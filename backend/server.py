# backend/server.py
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_ibm import WatsonxLLM
from langchain_core.prompts import PromptTemplate

# 1. Load Environment Variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allows React Native to access this

# 2. Get Credentials safely
w_api_key = os.getenv("WATSON_API_KEY")
w_project_id = os.getenv("IBM_PROJECT_ID")
w_url = os.getenv("WATSONX_URL")

# Check if keys exist before crashing later
if not w_api_key or not w_project_id:
    raise ValueError("❌ Error: API Key or Project ID missing in .env file")

# 3. Setup Watsonx
# Note: We pass the URL and Key directly. 
llm = WatsonxLLM(
    model_id="ibm/granite-3-8b-instruct", 
    url=w_url,
    apikey=w_api_key,
    project_id=w_project_id,
    params={
        "max_new_tokens": 25,     
        "min_new_tokens": 1,
        "repetition_penalty": 1.1,
        "temperature": 0.2,
        "top_p": 0.4,
        "top_k": 1
        
    }
)

# 4. Define Template
template = (
"You are a concise task-suggestion assistant."
"Given the user input: '{user_input}'"
"Output EXACTLY one short task title (max 6 words), on a single line, with NO quotes, NO explanation, and NO extra lines."
)
prompt = PromptTemplate(template=template, input_variables=["user_input"])

# 5. API Endpoint
@app.route('/suggest_task', methods=['POST'])
def suggest():
    data = request.json
    user_text = data.get('text', '')

    if len(user_text) < 3:
        return jsonify({"suggestion": ""})

    try:
        # Create and Run the Chain
        chain = prompt | llm 
        response = chain.invoke({"user_input": user_text})
        
        # DEBUGGING: Print result to your VS Code terminal to see what's happening
        print(f"User Input: {user_text}")
        print(f"AI Response: {response}")
        cleaned_response = response.strip().replace("'", "").replace('"', "")
        # .strip() removes accidental whitespace around the answer
        return jsonify({"suggestion": cleaned_response})
    
    except Exception as e:
        print(f"Error calling Watsonx: {e}")
        return jsonify({"error": "Failed to get suggestion"}), 500

if __name__ == '__main__':
    # 0.0.0.0 is crucial for mobile testing!
    app.run(host='0.0.0.0', port=5000, debug=True)