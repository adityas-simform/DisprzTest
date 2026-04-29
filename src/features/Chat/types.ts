export type MessageStatus = 'sending' | 'sent';

export interface Message {
  id: string;
  text: string;
  status: MessageStatus;
  timestamp: number;
}
