import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Fix: Change the function signature to match Next.js App Router requirements
export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { fileName, fileExtension, content } = await req.json();
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const prompt = generatePromptBasedOnFileType(fileName, fileExtension, content);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a code analyzer that creates structured mindmaps from source code files."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.2,
    });
    
    const analysisResult = response.choices[0].message.content || '';
    
    // Parse the structured response
    const parsedResult = parseAnalysisResult(analysisResult);
    
    // Fix: Use proper NextResponse format
    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Error analyzing file:', error);
    // Fix: Use proper NextResponse format for error
    return NextResponse.json({ error: 'Error analyzing file' }, { status: 500 });
  }
}

function generatePromptBasedOnFileType(fileName: string, fileExtension: string, content: string) {
  // Detect file category/purpose
  const fileCategory = detectFileCategory(fileName, content);
  
  const basePrompt = `
Analyze the following ${fileExtension} file named '${fileName}' (Category: ${fileCategory}) and create a structured mindmap representation.
The root node should be the filename. Create branches for major component categories, with specific implementations as sub-branches.
Your response should follow this exact format:

OVERVIEW: A brief 2-3 sentence summary explaining the file's purpose and category (e.g., API, Frontend, Database, etc.).

BRANCHES:
- [Major Component Category]
  - [Specific Implementation]
  - [Specific Implementation]
- [Another Major Category]
  - [Specific Implementation]
  - [Specific Implementation]

File content:
\`\`\`
${content}
\`\`\`
`;

  // Customize the prompt based on detected category
  switch (fileCategory) {
    case 'API':
      return basePrompt + `
Focus on:
- Endpoints (list all routes/endpoints)
- Request Handlers (specific handler functions)
- Middleware (authentication, validation, etc.)
- External Services (API clients, database connections)
- Error Handling (error cases and responses)
`;

    case 'Frontend':
      return basePrompt + `
Focus on:
- Components (React/Vue components)
- Hooks (custom hooks, effect hooks)
- State Management (contexts, stores)
- Event Handlers (user interactions)
- UI Elements (reusable UI parts)
`;

    case 'Database':
      return basePrompt + `
Focus on:
- Schema Definitions (models, types)
- Queries (database operations)
- Relationships (model associations)
- Migrations (schema changes)
- Utilities (database helpers)
`;

    case 'Service':
      return basePrompt + `
Focus on:
- Service Methods (API methods)
- Configuration (service setup)
- Authentication (auth methods)
- Data Processing (transformations)
- Error Handling (error cases)
`;

    case 'Utility':
      return basePrompt + `
Focus on:
- Helper Functions (utilities)
- Constants (configuration)
- Types/Interfaces (type definitions)
- Shared Logic (common functions)
- Tools (specific tools/utilities)
`;

    default:
      return basePrompt + `
Focus on:
- Major Functions (key functionality)
- Types/Interfaces (data structures)
- Logic Groups (related code)
- Dependencies (external modules)
- Utilities (helper functions)
`;
  }
}

function detectFileCategory(fileName: string, content: string): string {
  const lowerFileName = fileName.toLowerCase();
  const lowerContent = content.toLowerCase();

  if (lowerFileName.includes('api') || lowerFileName.includes('route') || content.includes('app.get(') || content.includes('app.post(')) {
    return 'API';
  }
  if (lowerFileName.includes('component') || content.includes('react') || content.includes('props') || content.includes('jsx')) {
    return 'Frontend';
  }
  if (lowerContent.includes('schema') || lowerContent.includes('model') || lowerFileName.includes('repository')) {
    return 'Database';
  }
  if (lowerFileName.includes('service') || lowerFileName.includes('client')) {
    return 'Service';
  }
  if (lowerFileName.includes('util') || lowerFileName.includes('helper')) {
    return 'Utility';
  }
  return 'General';
}

interface Branch {
  name: string;
  subBranches: string[];
}

function parseAnalysisResult(result: string) {
  // Parse the structured response
  const overviewMatch = result.match(/OVERVIEW:([\s\S]*?)(?=BRANCHES:|$)/i);
  const branchesMatch = result.match(/BRANCHES:([\s\S]*)/i);
  
  const overview = overviewMatch ? overviewMatch[1].trim() : '';
  
  const branches: Branch[] = [];
  if (branchesMatch) {
    const branchesText = branchesMatch[1].trim();
    const branchLines = branchesText.split('\n');
    let currentBranch: Branch | null = null;
    
    branchLines.forEach(line => {
      if (line.trim() === '') return;
      
      if (line.startsWith('- ')) {
        const branchName = line.replace('- ', '').trim();
        currentBranch = {
          name: branchName,
          subBranches: []
        };
        branches.push(currentBranch);
      } else if (line.startsWith('  - ') && currentBranch) {
        const subBranchName = line.replace('  - ', '').trim();
        currentBranch.subBranches.push(subBranchName);
      }
    });
  }
  
  return {
    overview,
    branches
  };
}