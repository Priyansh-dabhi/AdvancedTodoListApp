import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function main(context) {
  try {
    let requestBody;

    // ✨ FIX: Check if context.req.body is already an object or needs parsing
    if (typeof context.req.body === 'string' && context.req.body.length > 0) {
      try {
        requestBody = JSON.parse(context.req.body);
      } catch (parseError) {
        context.error("Failed to parse context.req.body as JSON:", parseError);
        // Fallback or error out if JSON parsing fails
        requestBody = {}; 
      }
    } else if (typeof context.req.body === 'object' && context.req.body !== null) {
      requestBody = context.req.body;
    } else {
      requestBody = {}; // Default to empty object if body is empty or malformed
    }
    
    const messages = requestBody.messages || []; // Safely get messages from the parsed body

    if (messages.length === 0) {
      return context.res.json({ text: "Hello! Ask me about your tasks." });
    }

    // Separate the latest user prompt from the older history
    const latestMessage = messages.pop(); 
    const latestPrompt = latestMessage.text;

    // Handle case where latestMessage might be undefined if messages array was just [user_message]
    if (!latestPrompt) {
        context.error("Latest prompt not found in messages.");
        return context.res.json({ error: "No prompt provided in message history." }, 400);
    }

    // Format the rest of the messages for Gemini's chat history
    const history = messages.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    // Init Gemini client
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Start a chat session with the history
    const chat = model.startChat({ history: history });
    
    // Send the newest message.
    const result = await chat.sendMessage(latestPrompt);
    const text = result.response.text();

    return context.res.json({ text });
    
  } catch (e) {
    context.error("Function execution error:", e); // More detailed error logging
    return context.res.json({ error: e.message || String(e) }, 500);
  }
}