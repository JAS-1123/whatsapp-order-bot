export interface BotResponse {
  text: string;
  buttons?: {
    id: string;
    title: string;
  }[];
}
