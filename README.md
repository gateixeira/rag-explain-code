# RAG Code Explanation Service

A demo REST API service that uses Retrieval-Augmented Generation (RAG) to load and analyze codebases, helping developers understand code through natural language queries.

## Features

- **Codebase Loading**: Load your codebase for analysis
- **Code Analysis**: Ask questions about your code in natural language and get AI-powered explanations

## Prerequisites

- Node.js
- npm
- OpenAI API key
- Environment variables configured (see Configuration section)

## Dependencies

This project uses:

- @langchain/community and @langchain/openai for RAG capabilities
- express for the REST API
- recursive-readdir for codebase scanning
- chromadb for vector storage

## Installation & Configuration

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure your environment:
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key # Required
   PORT=3000 # Optional, defaults to 3000
   ```

## Getting Started

1. Start the server:
   There are two ways to start the application:

   Using npm:

   ```bash
   npm start
   ```

   Or directly with Node:

   ```bash
   node server.js
   ```

2. Test the server:
   Once started, you can test the endpoints:

   - The server will be running at `http://localhost:3000`
   - Try loading a codebase using the `/load` endpoint
   - Then analyze code using the `/analyze` endpoint

3. Example usage with curl:

   ```bash
   # Load a codebase
   curl -X POST http://localhost:3000/load \
     -H "Content-Type: application/json" \
     -d '{"path": "/path/to/your/codebase"}'

   # Analyze code
   curl -X POST http://localhost:3000/analyze \
     -H "Content-Type: application/json" \
     -d '{"question": "What does this codebase do?"}'
   ```

## API Endpoints

### Load Codebase

```http
POST /load
```

Request body:

```json
{
  "path": "path/to/your/codebase"
}
```

Response:

```json
{
  "success": true
  // Additional load status information
}
```

### Analyze Code

```http
POST /analyze
```

Request body:

```json
{
  "question": "Your question about the code"
}
```

Response:

```json
{
  "answer": "AI-generated explanation of your code"
}
```

## Technical Architecture

This service uses a Retrieval-Augmented Generation (RAG) architecture to analyze codebases:

1. **Document Loading**: Uses recursive-readdir to scan all text files in the provided codebase
2. **Text Processing**: Splits code into chunks using LangChain's RecursiveCharacterTextSplitter
3. **Vector Storage**: Converts code chunks into embeddings using OpenAI's embedding model
4. **Retrieval**: When a question is asked, finds the most relevant code sections using vector similarity
5. **Generation**: Uses GPT-4 to generate explanations based on the retrieved code context

The system maintains the vector store in memory during runtime, so you need to reload the codebase if you restart the server.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
