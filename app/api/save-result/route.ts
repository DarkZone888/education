import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { answers, resultKey } = await req.json();

  const { error } = await supabase
    .from("results")
    .insert([{ answers, result_key: resultKey }]);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
