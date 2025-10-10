import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const FARMING_SYSTEM_PROMPT = `You are an expert agricultural advisor specializing in Indian farming practices. You have deep knowledge of:

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

Be conversational, helpful, and deeply knowledgeable. Support farmers with confidence and care.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log('Processing farming chat request for conversation:', conversationId);
    console.log('Message count:', messages.length);

    // Prepare messages with system prompt
    const allMessages = [
      { role: 'system', content: FARMING_SYSTEM_PROMPT },
      ...messages
    ];

    // Call Lovable AI Gateway with Gemini model (free during promo period)
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a moment.',
            code: 'RATE_LIMIT'
          }), 
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'AI credits exhausted. Please add credits to continue.',
            code: 'NO_CREDITS'
          }), 
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI model');
    }

    console.log('Successfully generated response, length:', assistantMessage.length);

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        conversationId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in farming-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'INTERNAL_ERROR'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
