import { Injectable } from '@nestjs/common';
import Openai from 'openai'; 


@Injectable()
export class ChatService {
  private openai: Openai;

  constructor() {
    this.openai = new Openai({ apiKey: 'API_KEY' });
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
          max_tokens: 50,
          n: 5 
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
          max_tokens: 50,
          n: 5 
        });
  
        return response.choices[0].message.content;
      } catch (error) {
        console.error('Error translating message:', error);
        throw error;
      }
  }

  /**
   * Méthode qui permet de générer des suggestions
   * @param message 
   * @returns 
   */
  async suggestionMessages(message: any): Promise<string[]> {
    const prompt = `${message} représente une discussion entre des personnes, propose-moi des réponses comme une personne qui participe à l'échange`;
    try {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: "user",
                content: prompt
            }],
            max_tokens: 50,
            stop: ['\n'], 
            n: 5 
        });

        const suggestions: string[] = response.choices.map(choice => choice.message.content);
        console.log('le tableau est ', suggestions);
        return suggestions;
    } catch (error) {
        console.error('Error generating suggestions:', error);
        throw error;
    }
  }

}
