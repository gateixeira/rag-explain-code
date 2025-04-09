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

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Dependencies

This project uses:

- @langchain/community and @langchain/openai for RAG capabilities
- express for the REST API
- recursive-readdir for codebase scanning
- chromadb for vector storage

## Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000 # Optional, defaults to 3000
OPENAI_API_KEY=your_openai_api_key # Required
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

## Running the Server

Start the server:

```bash
node server.js
```

The server will start running on http://localhost:3000 (or the port specified in your .env file).

## Error Handling

The API includes proper error handling for:

- Missing required parameters
- Server-side processing errors
- Invalid requests

All errors are returned with appropriate HTTP status codes and error messages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
