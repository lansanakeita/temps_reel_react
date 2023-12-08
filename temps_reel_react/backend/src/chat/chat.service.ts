import { Injectable } from '@nestjs/common';
import Openai from 'openai'; 


@Injectable()
export class ChatService {
  private openai: Openai;

  constructor() {
    this.openai = new Openai({ apiKey: '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' });
  }

  /**
   * Méthode qui permet de traduire le message dans la langue selectionnée
   * @param message 
   * @param targetLanguage 
   * @returns 
   */
  async translateMessage(message: string, targetLanguage: string): Promise<string> {
      const prompt = `traduit ${message} en ${targetLanguage} sans explication`;
  
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: "user",
            content: prompt
          }],
        });
  
        return response.choices[0].message.content;
      } catch (error) {
        console.error('Error translating message:', error);
        throw error;
      }
  }


    /**
     * Méthode qui permet de valider un message
     * @param message 
     * @returns 
     */
    async validateMessage(message: string): Promise<string> {
      const prompt = `vérifie la veracité de ${message}`;
  
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: "user",
            content: prompt
          }],
        });
  
        return response.choices[0].message.content;
      } catch (error) {
        console.error('Error translating message:', error);
        throw error;
      }
  }
}
