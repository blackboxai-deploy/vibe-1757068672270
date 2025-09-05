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
    const { question, studentCode, expectedSolution, testCases, language } = body;

    if (!question || !studentCode) {
      return NextResponse.json(
        { success: false, error: 'Question and student code are required' },
        { status: 400 }
      );
    }

    const result = await aiService.validateCodeAnswer(
      question,
      studentCode,
      expectedSolution || '',
      testCases || [],
      language || 'en'
    );

    if (result.success) {
      const parsedData = parseAIResponse(result);
      
      if (parsedData) {
        return NextResponse.json({
          success: true,
          data: parsedData,
          message: 'Code validated successfully'
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Failed to parse AI response' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to validate code' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Validate code API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}