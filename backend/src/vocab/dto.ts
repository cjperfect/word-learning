import { z } from 'zod';

export const createVocabDtoSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content too long'),
});

export type CreateVocabDto = z.infer<typeof createVocabDtoSchema>;
