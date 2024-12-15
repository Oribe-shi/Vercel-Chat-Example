import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabaseクライアントの作成
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");

// POST: 新しいチャットメッセージを追加
export async function POST(req: Request) {
    try {
        const { username, message } = await req.json();
        const timestamp = Date.now();

        // Supabaseにメッセージを保存
        const { error } = await supabase
            .from("chat_messages") // テーブル名
            .insert([{ username, message, timestamp }]);

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ success: false, error: "Error saving message" }, { status: 500 });
    }
}

// GET: チャット履歴を取得
export async function GET() {
    try {
        // Supabaseからチャット履歴を取得
        const { data, error } = await supabase
            .from("chat_messages") // テーブル名
            .select("*")
            .order("timestamp", { ascending: true }); // 時間順にソート

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ success: false, error: "Error fetching messages" }, { status: 500 });
    }
}
