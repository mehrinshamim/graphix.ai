# Grafix.AI 


### Team Name: Bonito Flakes


### Domain - Software Architecture

- **Codebase Analysis & Diagram Generation** - Analyze any given codebase and generate human-readable architecture diagrams, including high-level and low-level views, which can be exported to various image formats.

  
### Hosted Project Link
https://graphixai.vercel.app/


### Project Description
Grafix.AI simplifies open-source contributions by analyzing GitHub repositories and issues to identify key files related to an issue. It provides structured explanations of the code, helping contributors understand project architecture faster.

### The Problem Statement
"Open-source repositories are vast, and debugging is like searching for a needle in a haystack. Contributors waste time manually exploring files, and maintainers constantly guide them instead of focusing on innovation. There has to be a better way."

### The Solution
Grafix.AI automates the initial discovery process:
- Users paste a GitHub issue URL.
- The system analyzes the repository and finds the top 3 most relevant files.
- It explains each file based on its role (e.g., backend endpoints for Python, React components for frontend).
- Provides a structured overview of how the code connects, saving hours of manual effort.

## Technical Details
### Technologies/Components Used
For Software:
- *Languages:* Python, TypeScript
- *Frameworks:* FastAPI, Next.js
- *Libraries:* CodeBert
- *Tools:* Github API , OpenAI API, Gemini API


### Implementation

#### Backend (server)  
##### Installation  
```bash
# Clone the repository
git clone https://github.com/mehrinshamim/graphix.ai.git
cd graphix.ai/server

# Create a virtual environment and activate it
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements-server.txt -r model/requirements-model.txt

# Set up environment variables (GitHub API, OpenAI API, etc.)
# Create a `.env` file and add necessary keys

# Start the backend server
uvicorn app.main:app --reload
```  

##### Run  
```bash
# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate     # On Windows

# Run the backend server
uvicorn app.main:app --reload
```  

#### Frontend (client)  
##### Installation  
```bash
# Navigate to the frontend directory
cd ../client

# Install dependencies
npm install

# Set up environment variables if required
# Create a `.env` file and add necessary keys

# Start the frontend server
npm run dev
```  

##### Run  
```bash
npm run dev
```


### Project Documentation
#### Screenshots 
![1](https://github.com/user-attachments/assets/d22b413a-d937-442a-a8e5-8a3aa5818b12)

![2](https://github.com/user-attachments/assets/fbe3c4e2-9db4-40f2-9738-9c272fb25df2)

![3](https://github.com/user-attachments/assets/04e4d80d-402d-4805-9942-983c9bb4f025)

![4](https://github.com/user-attachments/assets/b5b4714c-d041-4976-85ae-393165ee7563)

The exported image
![5](https://github.com/user-attachments/assets/11d18050-464a-428c-bdf8-c87213b022ae)

![6](https://github.com/user-attachments/assets/e0b50563-5955-4739-b695-a0d9b242b4d6)


### Project Demo
#### Video
[ Graphix.ai - Bonito Flakes TinkHack 2.0 ](https://www.youtube.com/watch?v=m6mXxGlzNJ8)
Brief walkthrough of Grafix.AI in action.![5](https://github.com/user-attachments/assets/6e6a2c5b-5e17-46d7-8e08-e28862c8f8b1)


