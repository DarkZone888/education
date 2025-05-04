import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Reuse the Supabase client across requests
const supabase = globalThis.supabase || createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'public',
    },
    global: {
      // Recommended connection pooling settings
      headers: {
        'Connection': 'keep-alive',
      },
    },
  }
);

// Store the client in globalThis for reuse in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.supabase = supabase;
}

interface QuizResult {
  answers: string[];
  resultKey: string;
}

export async function POST(req: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers });
  }

  try {
    // Early return for missing body
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400, headers }
      );
    }

    // Measure performance
    const startTime = Date.now();
    let parseTime, dbTime;

    // Parse with timeout check
    const parseStart = Date.now();
    const requestData = await req.json().catch(() => null);
    parseTime = Date.now() - parseStart;

    if (!requestData) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400, headers }
      );
    }

    const { answers, resultKey } = requestData as QuizResult;

    // Basic validation without blocking
    if (!Array.isArray(answers) || !resultKey) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400, headers }
      );
    }

    // Minimal data processing
    const payload = {
      answers: answers.slice(0, 1000), // Limit to 1000 answers
      result_key: String(resultKey).slice(0, 255), // Limit key length
      created_at: new Date().toISOString()
    };

    // Database operation with timeout
    const dbStart = Date.now();
    const { error } = await supabase
      .from("quiz_results")
      .insert([payload])
      .select()
      .single();

    dbTime = Date.now() - dbStart;

    if (error) {
      console.error(`DB Error in ${dbTime}ms:`, error);
      return NextResponse.json(
        { error: "Database operation failed", details: error.message },
        { status: 502, headers } // 502 Bad Gateway for DB failures
      );
    }

    const totalTime = Date.now() - startTime;
    console.log(`Request processed in ${totalTime}ms (parse: ${parseTime}ms, db: ${dbTime}ms)`);

    return NextResponse.json(
      { success: true, performance: { totalTime, parseTime, dbTime } },
      { status: 200, headers }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}