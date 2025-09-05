import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { aiService, parseAIResponse } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const authResult = await AuthService.verifyToken(token);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { topic, difficulty, count, language } = body;

    if (!topic || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Topic and difficulty are required' },
        { status: 400 }
      );
    }

    const result = await aiService.generateCodeQuestions(
      topic,
      difficulty,
      count || 5,
      language || 'en'
    );

    if (result.success) {
      const parsedData = parseAIResponse(result);
      
      if (parsedData) {
        return NextResponse.json({
          success: true,
          data: parsedData,
          message: 'Questions generated successfully'
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Failed to parse AI response' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate questions' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Generate questions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}