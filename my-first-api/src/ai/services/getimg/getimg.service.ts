import { Injectable } from '@nestjs/common';
import GetimgAI from 'getimg-ai';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../../env.model';
@Injectable()
export class GetimgService {}

@Injectable()
export class GetimgAIService {
  private getimg: GetimgAI;

  constructor(configService: ConfigService<Env>) {
    const apiKey = configService.get('GETIMG_AI_API', { infer: true });
    if (!apiKey) {
      throw new Error(
        'GETIMG_AI_API is not defined in the environment variables',
      );
    }
    this.getimg = new GetimgAI({ apiKey });
  }

  async generateImage(text: string) {
    const prompt = `Generate an image for a blog post represents the following text: ${text}`;
    const response = await this.getimg.images.generate({
      model: 'seedream-5-lite',
      prompt,
      output_format: 'jpeg',
    });
    if (!response.data?.[0]?.url) {
      throw new Error('Failed to generate image');
    }
    return response.data[0].url;
  }
}
