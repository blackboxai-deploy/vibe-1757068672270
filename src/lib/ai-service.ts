// AI Service for OpenRouter Integration
import type { AIResponse } from '@/types';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIRequestBody {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

// AI Service Configuration
const AI_CONFIG = {
  endpoint: typeof window === 'undefined' 
    ? process.env.AI_API_ENDPOINT || 'https://oi-server.onrender.com/chat/completions'
    : 'https://oi-server.onrender.com/chat/completions',
  customerId: typeof window === 'undefined'
    ? process.env.AI_CUSTOMER_ID || 'cus_SGPn4uhjPI0F4w'
    : 'cus_SGPn4uhjPI0F4w',
  authorization: typeof window === 'undefined'
    ? process.env.AI_AUTHORIZATION || 'Bearer xxx'
    : 'Bearer xxx',
  defaultChatModel: typeof window === 'undefined'
    ? process.env.DEFAULT_CHAT_MODEL || 'openrouter/anthropic/claude-sonnet-4'
    : 'openrouter/anthropic/claude-sonnet-4',
  defaultImageModel: typeof window === 'undefined'
    ? process.env.DEFAULT_IMAGE_MODEL || 'replicate/black-forest-labs/flux-1.1-pro'
    : 'replicate/black-forest-labs/flux-1.1-pro',
  temperature: 0.5, // Balanced creativity and accuracy for educational content
  maxTokens: 4000,
  timeout: 300000 // 5 minutes for complex generation tasks
};

class AIService {
  private async makeRequest(body: AIRequestBody): Promise<AIResponse> {
    try {
      const response = await fetch(AI_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'customerId': AI_CONFIG.customerId,
          'Content-Type': 'application/json',
          'Authorization': AI_CONFIG.authorization,
        },
        body: JSON.stringify({
          ...body,
          temperature: body.temperature || AI_CONFIG.temperature,
          max_tokens: body.max_tokens || AI_CONFIG.maxTokens,
        }),
        signal: AbortSignal.timeout(AI_CONFIG.timeout),
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.choices?.[0]?.message?.content || data.content,
        usage: data.usage,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown AI service error',
      };
    }
  }

  // Generate Code Questions
  async generateCodeQuestions(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    count: number = 10,
    language: 'en' | 'fr' = 'en'
  ): Promise<AIResponse> {
    const systemPrompt = language === 'fr' ? 
      `Tu es un expert en éducation informatique. Génère ${count} questions de programmation de niveau ${difficulty} sur le sujet "${topic}".

Chaque question doit inclure:
- Un énoncé clair avec contexte
- Un champ de code à compléter
- Des critères d'évaluation précis
- Une explication détaillée de la solution
- Une estimation du temps requis

Format JSON requis:
{
  "questions": [
    {
      "id": "unique_id",
      "title": "Titre de la question",
      "content": "Énoncé complet avec contexte et instructions",
      "type": "code-completion",
      "difficulty": "${difficulty}",
      "points": 10,
      "estimatedTime": 15,
      "codeTemplate": "// Code de base à compléter\\nfunction example() {\\n  // VOTRE CODE ICI\\n}",
      "solution": "Solution complète",
      "explanation": "Explication détaillée de la solution",
      "testCases": [
        {"input": "entrée test", "expectedOutput": "sortie attendue"}
      ],
      "tags": ["tag1", "tag2"]
    }
  ]
}`
    : 
      `You are an expert computer science educator. Generate ${count} coding questions at ${difficulty} level for the topic "${topic}".

Each question should include:
- Clear problem statement with context
- Code completion field
- Precise evaluation criteria
- Detailed solution explanation
- Time estimation

Required JSON format:
{
  "questions": [
    {
      "id": "unique_id",
      "title": "Question Title",
      "content": "Complete problem statement with context and instructions",
      "type": "code-completion",
      "difficulty": "${difficulty}",
      "points": 10,
      "estimatedTime": 15,
      "codeTemplate": "// Base code to complete\\nfunction example() {\\n  // YOUR CODE HERE\\n}",
      "solution": "Complete solution",
      "explanation": "Detailed explanation of the solution",
      "testCases": [
        {"input": "test input", "expectedOutput": "expected output"}
      ],
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: language === 'fr' ? 
          `Génère ${count} questions de programmation sur "${topic}" de niveau ${difficulty}.` :
          `Generate ${count} coding questions about "${topic}" at ${difficulty} level.`
      }
    ];

    return await this.makeRequest({
      model: AI_CONFIG.defaultChatModel,
      messages,
    });
  }

  // Analyze Code for Review
  async analyzeCode(
    code: string,
    language: string,
    specifications?: string,
    standards?: string,
    reviewLanguage: 'en' | 'fr' = 'en'
  ): Promise<AIResponse> {
    const systemPrompt = reviewLanguage === 'fr' ?
      `Tu es un expert en révision de code. Analyse le code fourni selon ces critères:

1. **Lisibilité** (0-100): Clarté, nommage, structure
2. **Performance** (0-100): Efficacité algorithmique, optimisation
3. **Sécurité** (0-100): Vulnérabilités, bonnes pratiques sécuritaires
4. **Maintenabilité** (0-100): Facilité de modification, documentation
5. **Bonnes Pratiques** (0-100): Conventions, patterns, architecture

Fournis aussi:
- Liste d'améliorations spécifiques avec numéros de ligne
- Questions d'aide pour les non-techniques
- Score global et commentaires détaillés

Format JSON requis:
{
  "analysis": {
    "readability": 85,
    "performance": 70,
    "security": 90,
    "maintainability": 75,
    "bestPractices": 80,
    "comments": ["Commentaire détaillé 1", "Commentaire détaillé 2"]
  },
  "improvements": [
    {
      "line": 15,
      "type": "warning",
      "message": "Description du problème",
      "suggestion": "Solution proposée",
      "priority": "high"
    }
  ],
  "helperQuestions": [
    {
      "question": "Question pour aider à comprendre",
      "context": "Contexte de la question",
      "suggestedResponse": "Réponse suggérée"
    }
  ],
  "overallScore": 80,
  "summary": "Résumé de l'analyse"
}`
    :
      `You are a code review expert. Analyze the provided code based on these criteria:

1. **Readability** (0-100): Clarity, naming, structure
2. **Performance** (0-100): Algorithmic efficiency, optimization
3. **Security** (0-100): Vulnerabilities, security best practices
4. **Maintainability** (0-100): Ease of modification, documentation
5. **Best Practices** (0-100): Conventions, patterns, architecture

Also provide:
- List of specific improvements with line numbers
- Helper questions for non-technical reviewers
- Overall score and detailed comments

Required JSON format:
{
  "analysis": {
    "readability": 85,
    "performance": 70,
    "security": 90,
    "maintainability": 75,
    "bestPractices": 80,
    "comments": ["Detailed comment 1", "Detailed comment 2"]
  },
  "improvements": [
    {
      "line": 15,
      "type": "warning",
      "message": "Issue description",
      "suggestion": "Proposed solution",
      "priority": "high"
    }
  ],
  "helperQuestions": [
    {
      "question": "Question to help understand",
      "context": "Question context",
      "suggestedResponse": "Suggested response"
    }
  ],
  "overallScore": 80,
  "summary": "Analysis summary"
}`;

    const codeContext = `
**Programming Language**: ${language}
${specifications ? `**Project Specifications**: ${specifications}` : ''}
${standards ? `**Coding Standards**: ${standards}` : ''}

**Code to Analyze**:
\`\`\`${language}
${code}
\`\`\`
`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: codeContext }
    ];

    return await this.makeRequest({
      model: AI_CONFIG.defaultChatModel,
      messages,
    });
  }

  // Generate MCQ from LaTeX content
  async generateMCQFromLatex(
    latexContent: string,
    numberOfQuestions: number = 20,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
    language: 'en' | 'fr' = 'en',
    topic?: string
  ): Promise<AIResponse> {
    const systemPrompt = language === 'fr' ?
      `Tu es un expert en création d'examens éducatifs. À partir du contenu LaTeX fourni, génère ${numberOfQuestions} questions à choix multiples de niveau ${difficulty}.

Chaque question doit:
- Tester la compréhension des compétences clés du sujet
- Avoir 4 options de réponse (A, B, C, D)
- Avoir UNE seule réponse correcte
- Inclure une explication détaillée
- Être basée sur le contenu LaTeX fourni

Format JSON requis:
{
  "exam": {
    "title": "Titre de l'examen basé sur le contenu",
    "topic": "${topic || 'Dérivé du contenu LaTeX'}",
    "difficulty": "${difficulty}",
    "totalQuestions": ${numberOfQuestions},
    "questions": [
      {
        "id": "q1",
        "question": "Question complète avec contexte",
        "options": [
          {"id": "A", "text": "Option A", "isCorrect": false},
          {"id": "B", "text": "Option B", "isCorrect": true},
          {"id": "C", "text": "Option C", "isCorrect": false},
          {"id": "D", "text": "Option D", "isCorrect": false}
        ],
        "explanation": "Explication détaillée de pourquoi B est correct",
        "difficulty": "${difficulty}",
        "points": 5,
        "topic": "Sous-sujet spécifique"
      }
    ]
  }
}`
    :
      `You are an expert educational exam creator. From the provided LaTeX content, generate ${numberOfQuestions} multiple-choice questions at ${difficulty} level.

Each question should:
- Test understanding of key competencies from the subject
- Have 4 answer options (A, B, C, D)
- Have ONE correct answer only
- Include detailed explanation
- Be based on the provided LaTeX content

Required JSON format:
{
  "exam": {
    "title": "Exam title based on content",
    "topic": "${topic || 'Derived from LaTeX content'}",
    "difficulty": "${difficulty}",
    "totalQuestions": ${numberOfQuestions},
    "questions": [
      {
        "id": "q1",
        "question": "Complete question with context",
        "options": [
          {"id": "A", "text": "Option A", "isCorrect": false},
          {"id": "B", "text": "Option B", "isCorrect": true},
          {"id": "C", "text": "Option C", "isCorrect": false},
          {"id": "D", "text": "Option D", "isCorrect": false}
        ],
        "explanation": "Detailed explanation of why B is correct",
        "difficulty": "${difficulty}",
        "points": 5,
        "topic": "Specific subtopic"
      }
    ]
  }
}`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: language === 'fr' ?
          `Voici le contenu LaTeX pour générer l'examen:\n\n${latexContent}` :
          `Here is the LaTeX content to generate the exam from:\n\n${latexContent}`
      }
    ];

    return await this.makeRequest({
      model: AI_CONFIG.defaultChatModel,
      messages,
      max_tokens: 6000, // Increased for longer exam generation
    });
  }

  // Validate student code answer
  async validateCodeAnswer(
    question: string,
    studentCode: string,
    expectedSolution: string,
    testCases: Array<{input: string; expectedOutput: string}>,
    language: 'en' | 'fr' = 'en'
  ): Promise<AIResponse> {
    const systemPrompt = language === 'fr' ?
      `Tu es un correcteur expert en programmation. Évalue la réponse de l'étudiant selon ces critères:

1. **Exactitude** (0-100): La solution résout-elle le problème correctement?
2. **Efficacité** (0-100): L'algorithme est-il optimal?
3. **Style** (0-100): Le code suit-il les bonnes pratiques?
4. **Complétude** (0-100): Toutes les exigences sont-elles satisfaites?

Format JSON requis:
{
  "evaluation": {
    "correctness": 85,
    "efficiency": 70,
    "style": 90,
    "completeness": 80,
    "overallScore": 81,
    "passed": true
  },
  "feedback": "Commentaires détaillés pour l'étudiant",
  "suggestions": ["Amélioration 1", "Amélioration 2"],
  "testResults": [
    {"test": 1, "passed": true, "expected": "5", "actual": "5"},
    {"test": 2, "passed": false, "expected": "10", "actual": "8"}
  ]
}`
    :
      `You are an expert programming grader. Evaluate the student's answer based on these criteria:

1. **Correctness** (0-100): Does the solution solve the problem correctly?
2. **Efficiency** (0-100): Is the algorithm optimal?
3. **Style** (0-100): Does the code follow best practices?
4. **Completeness** (0-100): Are all requirements satisfied?

Required JSON format:
{
  "evaluation": {
    "correctness": 85,
    "efficiency": 70,
    "style": 90,
    "completeness": 80,
    "overallScore": 81,
    "passed": true
  },
  "feedback": "Detailed feedback for the student",
  "suggestions": ["Improvement 1", "Improvement 2"],
  "testResults": [
    {"test": 1, "passed": true, "expected": "5", "actual": "5"},
    {"test": 2, "passed": false, "expected": "10", "actual": "8"}
  ]
}`;

    const context = `
**Question**: ${question}

**Expected Solution**:
\`\`\`
${expectedSolution}
\`\`\`

**Student's Code**:
\`\`\`
${studentCode}
\`\`\`

**Test Cases**:
${testCases.map((test, i) => `Test ${i + 1}: Input: ${test.input}, Expected Output: ${test.expectedOutput}`).join('\n')}
`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: context }
    ];

    return await this.makeRequest({
      model: AI_CONFIG.defaultChatModel,
      messages,
    });
  }

  // Generate image for educational content
  async generateEducationalImage(
    description: string,
    context: string = 'educational platform'
  ): Promise<AIResponse> {
    const prompt = `Educational illustration: ${description}. Context: ${context}. Style: clean, professional, modern educational design suitable for academic platform. High quality, clear, and engaging for students and professors.`;

    return await this.makeRequest({
      model: AI_CONFIG.defaultImageModel,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export utility functions
export const parseAIResponse = <T>(response: AIResponse): T | null => {
  if (!response.success || !response.data) {
    console.error('AI Response Error:', response.error);
    return null;
  }

  try {
    let dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    
    // Remove markdown code blocks if present
    dataStr = dataStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    dataStr = dataStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    // Try to extract JSON from the content if it's wrapped in text
    const jsonMatch = dataStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      dataStr = jsonMatch[0];
    }
    
    return JSON.parse(dataStr);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Raw response data:', response.data);
    return null;
  }
};

export const validateAIResponse = (response: any, requiredFields: string[]): boolean => {
  if (!response || typeof response !== 'object') return false;
  
  return requiredFields.every(field => {
    const keys = field.split('.');
    let current = response;
    
    for (const key of keys) {
      if (current[key] === undefined) return false;
      current = current[key];
    }
    
    return true;
  });
};