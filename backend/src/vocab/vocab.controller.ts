import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VocabService } from './vocab.service';
import type { CreateVocabDto } from './dto';

@Controller('vocab')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createVocabDto: CreateVocabDto) {
    return this.vocabService.create(createVocabDto.content);
  }

  @Get('list')
  findAll() {
    return this.vocabService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabService.findOne(id);
  }

  @Post('analyze/:id')
  analyze(@Param('id') id: string) {
    return this.vocabService.analyze(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabService.remove(id);
  }
}
