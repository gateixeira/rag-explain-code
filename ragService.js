const { ChatOpenAI } = require('@langchain/openai');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { TextLoader } = require('langchain/document_loaders/fs/text');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const recursiveReadDir = require('recursive-readdir');
const fs = require('fs').promises;
const path = require('path');

async function isTextFile(filePath) {
    try {
        const buffer = await fs.readFile(filePath);
        return !buffer.includes(0x00); // Simple binary check
    } catch (error) {
        return false;
    }
}

async function loadDocuments(dirPath) {
    const files = await recursiveReadDir(dirPath);
    const documents = [];

    for (const file of files) {
        if (await isTextFile(file)) {
            try {
                const loader = new TextLoader(file);
                const docs = await loader.load();
                docs.forEach(doc => {
                    doc.metadata.source = path.relative(dirPath, file);
                });
                documents.push(...docs);
            } catch (error) {
                console.warn(`Error loading file ${file}:`, error.message);
            }
        }
    }

    return documents;
}

let vectorStore = null;

async function loadCodebase(dirPath) {
    const embeddings = new OpenAIEmbeddings();
    
    // Load and process documents
    console.log('Loading documents...');
    const documents = await loadDocuments(dirPath);
    
    // Split documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(documents);

    // Create vector store in memory
    console.log('Creating vector store...');
    vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings
    );
    
    return { message: 'Codebase loaded successfully' };
}

async function analyzeCode(question) {
    if (!vectorStore) {
        throw new Error('Codebase not loaded. Please load a codebase first.');
    }

    const model = new ChatOpenAI({
        temperature: 0,
        modelName: 'gpt-4-turbo-preview',
    });

    // Create retriever
    const retriever = vectorStore.asRetriever({
        k: 5, // Number of relevant chunks to retrieve
    });

    // Get relevant documents
    const relevantDocs = await retriever.getRelevantDocuments(question);

    // Format context from relevant documents
    const context = relevantDocs.map(doc => {
        return `File: ${doc.metadata.source}\nContent:\n${doc.pageContent}\n---\n`;
    }).join('\n');

    // Generate response using OpenAI
    const response = await model.invoke(
        `You are a helpful assistant for understanding codebases. Based on the following code context, please answer this question: "${question}"\n\nContext:\n${context}`
    );

    return response.content;
}

module.exports = { loadCodebase, analyzeCode };