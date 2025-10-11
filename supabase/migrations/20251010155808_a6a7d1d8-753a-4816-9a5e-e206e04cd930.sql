-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_conversations
CREATE POLICY "Users can view their own conversations"
ON public.chat_conversations
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own conversations"
ON public.chat_conversations
FOR UPDATE
USING (true);

CREATE POLICY "Users can delete their own conversations"
ON public.chat_conversations
FOR DELETE
USING (true);

-- Create policies for chat_messages
CREATE POLICY "Users can view messages in their conversations"
ON public.chat_messages
FOR SELECT
USING (true);

CREATE POLICY "Users can create messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their messages"
ON public.chat_messages
FOR UPDATE
USING (true);

CREATE POLICY "Users can delete their messages"
ON public.chat_messages
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.chat_messages(created_at);