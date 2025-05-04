import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Configure for Vercel environment
const supabaseOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Connection': 'keep-alive',
      'X-Client-Info': 'quiz-api/vercel'
    },
  }
};

const supabase = globalThis.supabase || createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  supabaseOptions
);

if (process.env.NODE_ENV !== 'production') {
  globalThis.supabase = supabase;
}

export const config = {
  runtime: 'nodejs', // Force Node.js runtime (not Edge)
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export async function POST(req: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers });
  }

  try {
    // Debugging: Log environment status
    console.log('Supabase URL exists:', !!process.env.SUPABASE_URL);
    
    const bodyText = await req.text();
    if (!bodyText) {
      console.error('Empty request body');
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400, headers }
      );
    }

    const requestData = JSON.parse(bodyText);
    console.log('Received data:', requestData);

    const { answers, resultKey } = requestData;

    // Basic validation
    if (!Array.isArray(answers) || !resultKey) {
      console.error('Validation failed:', { answers, resultKey });
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400, headers }
      );
    }

    // Database operation with timeout
    const dbResponse = await supabase
      .from("quiz_results")
      .insert([{
        answers: answers.slice(0, 500), // Safety limit
        result_key: resultKey.slice(0, 255),
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
      .timeout(5000); // 5 second timeout

    if (dbResponse.error) {
      console.error('Supabase error:', dbResponse.error);
      return NextResponse.json(
        { 
          error: "Database operation failed",
          details: dbResponse.error.message 
        },
        { status: 502, headers }
      );
    }

    console.log('Successfully stored:', dbResponse.data);
    return NextResponse.json(
      { success: true, data: dbResponse.data },
      { status: 200, headers }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    );
  }
}