export enum Sender {
  USER = 'USER',
  GEMINI = 'GEMINI',
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
}
