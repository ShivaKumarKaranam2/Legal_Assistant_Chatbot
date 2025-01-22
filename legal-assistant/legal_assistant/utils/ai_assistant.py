import os
import json
import google.generativeai as genai
from typing import Dict, List, Optional

class LegalAIAssistant:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Legal AI Assistant
        
        :param api_key: Optional Gemini API key, defaults to environment variable
        """
        api_key = "GEMINI_API_KEY"

        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        
        # Validate API key
        if not self.api_key:
            raise ValueError("No Gemini API key provided. Set GEMINI_API_KEY environment variable.")
        
        self._configure_gemini()
        self.legal_data = self._load_legal_data()

    def _configure_gemini(self):
        """
        Configure Gemini AI with the provided API key
        """
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        except Exception as e:
            raise ValueError(f"Gemini AI Configuration Error: {str(e)}")

    def _load_legal_data(self) -> Dict:

        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_dir = os.path.join(base_dir, 'data')
            
            legal_data = {
                "constitution": self._load_json_file(os.path.join(data_dir, 'constitution_qa.json')),
                "crpc": self._load_json_file(os.path.join(data_dir, 'crpc_qa.json')),
                "ipc": self._load_json_file(os.path.join(data_dir, 'ipc_qa.json'))
            }
            return legal_data
        except Exception as e:
            print(f"Warning: Could not load legal data - {e}")
            return {}

    def _load_json_file(self, file_path: str) -> List[Dict]:
        """
        Load a JSON file
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"File not found: {file_path}")
            return []
        except json.JSONDecodeError:
            print(f"Invalid JSON in file: {file_path}")
            return []

    def generate_legal_response(self, query: str) -> Dict:
        """
        Generate a legal response for the given query
        
        :param query: Legal query string
        :return: Dictionary containing response and query
        """
        try:
            # Create comprehensive prompt
            prompt = self.create_legal_prompt(query)
            
            # Generate content using Gemini AI
            response = self.model.generate_content(prompt)
            
            # Return structured response
            return {
                "response": response.text,
                "query": query,
                "key_points": self.extract_key_points(response.text)
            }
        except Exception as e:
            return {
                "error": str(e),
                "query": query
            }

    def create_legal_prompt(self, query: str) -> str:
        """
        Create a comprehensive legal prompt
        
        :param query: Original legal query
        :return: Formatted prompt for AI
        """
        legal_resources = ", ".join(self.legal_data.keys())
        return f"""
        You are an advanced AI Legal Assistant with comprehensive knowledge of legal principles.

        Available Legal Resources: {legal_resources}

        Legal Query: {query}

        Response Guidelines:
        1. Analyze the legal query with precision
        2. Provide a structured response including:
           a) Legal Context
           b) Potential Implications
           c) Recommended Actions
           d) Relevant Legal Principles
        3. Cite general legal principles and precedents
        4. Explain complex legal concepts in accessible language
        5. Highlight potential risks and limitations
        6. Recommend consulting a professional lawyer for specific advice

        Important Disclaimer: This is general legal information, not personalized legal advice.
        Always consult a qualified legal professional for specific legal guidance.
        """

    def extract_key_points(self, response: str) -> List[str]:
        """
        Extract key points from the legal response
        
        :param response: Full legal response text
        :return: List of key points
        """
        sentences = response.split('.')
        key_points = [
            sentence.strip() 
            for sentence in sentences 
            if len(sentence.strip().split()) > 5
        ]
        
        return key_points[:5]

    def validate_query(self, query: str) -> bool:
        """
        Validate the input query
        
        :param query: Input query string
        :return: Boolean indicating query validity
        """
        if not query:
            return False
        
        if len(query.strip()) < 10:
            return False
        
        return True

    def get_legal_categories(self) -> List[str]:
        """
        Provide list of legal categories the AI can assist with
        
        :return: List of legal categories
        """
        return list(self.legal_data.keys())
