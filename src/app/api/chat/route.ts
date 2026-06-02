import { NextResponse } from "next/server";

/**
 * DeepSeek API proxy route.
 * Forwards request to api.deepseek.com, returns SSE stream.
 * Uses the user's API key from x-api-key header.
 */

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "缺少 API Key，请在设置中配置" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { messages, model, stream = true } = body;

    if (!messages || !model) {
      return NextResponse.json(
        { error: "缺少 messages 或 model 参数" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          stream,
          max_tokens: 8192,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      return NextResponse.json(
        { error: `DeepSeek API 错误 (${response.status}): ${err}` },
        { status: response.status },
      );
    }

    if (!stream) {
      // Non-streaming: just proxy the JSON response
      const data = await response.json();
      return NextResponse.json(data);
    }

    // SSE streaming: forward the stream
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch {
          // stream interrupted
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `服务器错误: ${err instanceof Error ? err.message : "未知"}` },
      { status: 500 },
    );
  }
}
