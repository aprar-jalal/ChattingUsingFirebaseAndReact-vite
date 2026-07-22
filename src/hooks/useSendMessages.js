import { createMessage } from "../services/MessagesService";

export function useSendMessage(){
  async function sendMessage(chatId, messageData){
    return await createMessage(
      chatId,
      messageData
    );
  }
  return {
    sendMessage
  };

}