import { NextResponse } from 'next/server';
import { GenerateContentRequestSchema } from '@/types/gemini';
import { GeminiService } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = GenerateContentRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body', details: result.error.format() }, { status: 400 });
    }

    const responseContent = await GeminiService.generateContent(result.data);
    return NextResponse.json(responseContent);
  } catch (error) {
    console.error('Error in /api/learn/generate-cycle-content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
