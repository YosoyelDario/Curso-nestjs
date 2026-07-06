import { Module } from '@nestjs/common';
import { OpenaiService } from '../ai/services/openai/openai.service';
import { GetimgAIService } from './services/getimg/getimg.service';

@Module({
  providers: [OpenaiService, GetimgAIService],
  exports: [OpenaiService, GetimgAIService],
})
export class AiModule {}
