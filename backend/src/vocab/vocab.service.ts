import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

@Injectable()
export class VocabService {
  private readonly logger = new Logger(VocabService.name);
  private zhipu: ZhipuAI;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      this.logger.warn('ZHIPU_API_KEY not set, AI analysis will fail');
    }
    this.zhipu = new ZhipuAI({ apiKey });
  }

  async create(content: string) {
    const dateGroup = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    return this.prisma.vocabEntry.create({
      data: { content, dateGroup },
    });
  }

  async findAll() {
    const entries = await this.prisma.vocabEntry.findMany({
      orderBy: [
        { dateGroup: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Group by dateGroup
    const grouped = entries.reduce((acc, entry) => {
      const date = entry.dateGroup;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {} as Record<string, typeof entries>);

    return grouped;
  }

  async findOne(id: string) {
    const entry = await this.prisma.vocabEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException(`Vocab entry with id ${id} not found`);
    }

    return entry;
  }

  async analyze(id: string) {
    const entry = await this.findOne(id);

    try {
      const prompt = `作为英语专家，分析文本：${entry.content}。
返回 JSON 格式（不要包含任何其他文字），包含：
{
  "pos": "词性",
  "cn": "中文释义",
  "etymology": "词源/词根分析",
  "sentences": ["例句1", "例句2"],
  "tips": "记忆技巧"
}`;

      const response = await this.zhipu.createCompletions({
        model: 'glm-4',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }) as any;

      // Handle response format
      let content: string;
      if (response.choices && response.choices[0] && response.choices[0].message) {
        content = response.choices[0].message.content;
      } else if (response.data && response.data.choices && response.data.choices[0]) {
        content = response.data.choices[0].message.content;
      } else if (response.content) {
        content = response.content;
      } else {
        this.logger.error('Unexpected response format:', JSON.stringify(response));
        throw new BadRequestException('Unexpected AI response format');
      }

      // Extract JSON from response (remove potential markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new BadRequestException('AI response does not contain valid JSON');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      return this.prisma.vocabEntry.update({
        where: { id },
        data: {
          pos: analysis.pos,
          translation: analysis.cn,
          aiAnalysis: analysis,
        },
      });
    } catch (error) {
      this.logger.error('AI analysis failed', error);
      throw new BadRequestException('AI analysis failed: ' + error.message);
    }
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence

    return this.prisma.vocabEntry.delete({
      where: { id },
    });
  }
}
