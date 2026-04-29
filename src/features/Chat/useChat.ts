import { useCallback, useRef, useState } from 'react';

import { DUMMY_API_DELAY_MS } from './constants';
import type { Message } from './types';

const sendMessageApi = (text: string): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text.trim().length === 0) {
        reject(new Error('Message text cannot be empty'));
        return;
      }
      resolve();
    }, DUMMY_API_DELAY_MS);
  });

interface UseChatReturn {
  messages: Message[];
  inputText: string;
  isSending: boolean;
  sendError: string | null;
  setInputText: (text: string) => void;
  sendMessage: () => Promise<void>;
}

const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const idCounterRef = useRef<number>(0);
  // Ref so sendMessage never needs inputText as a dependency
  const inputTextRef = useRef<string>(inputText);

  const handleSetInputText = useCallback((text: string): void => {
    inputTextRef.current = text;
    setInputText(text);
  }, []);

  const sendMessage = useCallback(async (): Promise<void> => {
    const trimmed = inputTextRef.current.trim();
    if (trimmed.length === 0) {
      return;
    }

    idCounterRef.current += 1;
    const messageId = String(idCounterRef.current);

    const newMessage: Message = {
      id: messageId,
      text: trimmed,
      status: 'sending',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    handleSetInputText('');
    setIsSending(true);
    setSendError(null);

    try {
      await sendMessageApi(trimmed);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'sent' } : msg,
        ),
      );
    } catch (error) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'sent' } : msg,
        ),
      );
      setSendError(
        `Failed to send message: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    } finally {
      setIsSending(false);
    }
  }, [handleSetInputText]);

  return { messages, inputText, isSending, sendError, setInputText: handleSetInputText, sendMessage };
};

export default useChat;
