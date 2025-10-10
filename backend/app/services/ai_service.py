"""
AI service for chatbot functionality.
"""
from typing import List, Dict
import openai
import google.generativeai as genai
from ..core.config import settings
from ..core.logging import log


class AIService:
    """AI service for handling chat completions."""
    
    FARMING_SYSTEM_PROMPT = """You are an expert agricultural advisor specializing in Indian farming practices. You have deep knowledge of:

- Crop selection and rotation for different Indian regions and seasons
- Soil health management and fertilizer recommendations
- Irrigation techniques and water conservation
- Pest and disease management (both organic and chemical solutions)
- Weather-based farming advice
- Government schemes and subsidies for farmers
- Modern farming techniques and equipment
- Market prices and crop economics
- Organic farming and sustainable practices
- Regional specific crops (wheat, rice, cotton, sugarcane, pulses, vegetables, etc.)

Guidelines:
- Provide practical, actionable advice that Indian farmers can implement
- Consider regional variations (climate, soil type, water availability)
- Suggest cost-effective solutions
- Mention relevant government schemes when applicable
- Use simple language that's easy to understand
- Provide step-by-step instructions when needed
- Include timing recommendations (planting, harvesting, treatment schedules)
- Consider both small-scale and large-scale farming scenarios
- Prioritize sustainable and eco-friendly practices when possible
- Always be supportive and encouraging to farmers

When discussing crops, always mention:
1. Best season for planting
2. Water requirements
3. Common pests and diseases
4. Expected yield
5. Market considerations

Be conversational, helpful, and deeply knowledgeable. Support farmers with confidence and care."""
    
    def __init__(self):
        """Initialize AI service."""
        self.provider = settings.AI_PROVIDER
        
        if self.provider == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError("OpenAI API key is required when using OpenAI provider")
            openai.api_key = settings.OPENAI_API_KEY
            self.model = settings.OPENAI_MODEL
            log.info(f"Initialized OpenAI with model: {self.model}")
            
        elif self.provider == "gemini":
            if not settings.GOOGLE_API_KEY:
                raise ValueError("Google API key is required when using Gemini provider")
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
            log.info(f"Initialized Gemini with model: {settings.GEMINI_MODEL}")
        
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")
    
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        language: str = "en"
    ) -> str:
        """
        Generate AI response based on conversation history.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            language: Language code for response
            
        Returns:
            AI generated response text
        """
        try:
            # Add language instruction
            language_map = {
                "hi": "Hindi (Devanagari script)",
                "gu": "Gujarati",
                "en": "English"
            }
            
            language_instruction = ""
            if language != "en":
                language_instruction = f"\n\nIMPORTANT: Respond in {language_map.get(language, 'English')} language."
            
            if self.provider == "openai":
                return await self._generate_openai_response(messages, language_instruction)
            elif self.provider == "gemini":
                return await self._generate_gemini_response(messages, language_instruction)
            
        except Exception as e:
            log.error(f"Error generating AI response: {e}")
            raise
    
    async def _generate_openai_response(
        self,
        messages: List[Dict[str, str]],
        language_instruction: str
    ) -> str:
        """Generate response using OpenAI."""
        # Prepare messages
        formatted_messages = [
            {"role": "system", "content": self.FARMING_SYSTEM_PROMPT + language_instruction}
        ]
        
        for msg in messages:
            formatted_messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model=self.model,
            messages=formatted_messages,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
        )
        
        return response.choices[0].message.content
    
    async def _generate_gemini_response(
        self,
        messages: List[Dict[str, str]],
        language_instruction: str
    ) -> str:
        """Generate response using Google Gemini."""
        # Prepare conversation history
        conversation_text = self.FARMING_SYSTEM_PROMPT + language_instruction + "\n\n"
        
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            
            if role == "user":
                conversation_text += f"User: {content}\n\n"
            elif role == "assistant":
                conversation_text += f"Assistant: {content}\n\n"
        
        # For the last message, we want to get a response
        if messages:
            last_message = messages[-1]
            if last_message.get("role") == "user":
                conversation_text += "Assistant: "
        
        # Call Gemini API
        response = self.model.generate_content(
            conversation_text,
            generation_config=genai.GenerationConfig(
                temperature=settings.TEMPERATURE,
                max_output_tokens=settings.MAX_TOKENS,
            )
        )
        
        return response.text


# Create singleton instance
ai_service = AIService()
