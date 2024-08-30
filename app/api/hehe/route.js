import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

// Load the model
let modelPromise = null;

async function loadModel() {
  if (!modelPromise) {
    modelPromise = use.load();
  }
  return modelPromise;
}

// Named export for POST method
export async function POST(req) {
  try {
    const { extraInfo, userQuestion } = await req.json();

    // Log the incoming request body
    console.log('Received request body:', { extraInfo, userQuestion });

    // Validate if extraInfo is an array
    if (!Array.isArray(extraInfo) || extraInfo.length === 0) {
      return new Response(JSON.stringify({ error: 'extraInfo must be an array, or extraInfo is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Load the model
    const model = await loadModel();

    // Compute embeddings for all extra info items and the user question
    const allSentences = [...extraInfo, userQuestion];
    const embeddings = await model.embed(allSentences);

    // Extract the question embedding (the last one)
    const questionEmbedding = embeddings.slice([extraInfo.length, 0], [1]);

    const relevantInfo = [];
    const threshold = 0.5; // Set a threshold for determining relevance

    // Calculate cosine similarity manually
    function cosineSimilarity(embedding1, embedding2) {
      const dotProduct = tf.dot(tf.squeeze(embedding1), tf.squeeze(embedding2)).dataSync()[0];
      const norm1 = tf.norm(tf.squeeze(embedding1)).dataSync()[0];
      const norm2 = tf.norm(tf.squeeze(embedding2)).dataSync()[0];
      return dotProduct / (norm1 * norm2);
    }

    // Iterate over each extra info embedding
    for (let i = 0; i < extraInfo.length; i++) {
      const extraEmbedding = embeddings.slice([i, 0], [1]);

      // Calculate cosine similarity between the question and each extra info
      const similarity = cosineSimilarity(extraEmbedding, questionEmbedding);

      if (similarity > threshold) {
        relevantInfo.push(extraInfo[i]);
      }
    }

    // Send response back with relevant info
    return new Response(JSON.stringify({ response: relevantInfo }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
