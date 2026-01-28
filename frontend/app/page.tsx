'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import MatrixInput from '@/components/MatrixInput';
import VocabGrid from '@/components/VocabGrid';
import { vocabApi } from '@/lib/api';
import { VocabGrouped } from '@/lib/types';

const fetcher = () => vocabApi.list();

export default function Home() {
  const { data: entries, mutate, isLoading } = useSWR<VocabGrouped>('vocab', fetcher);

  const handleSave = async (content: string) => {
    await vocabApi.create(content);
    mutate();
  };

  return (
    <div className="min-h-screen">
      {/* Matrix Input */}
      <MatrixInput onSave={handleSave} />

      {/* Vocab Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="bg-white rounded-2xl px-10 py-6 border border-gray-200 shadow-sm">
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      ) : (
        <VocabGrid entries={entries || {}} onUpdate={mutate} onDelete={mutate} />
      )}
    </div>
  );
}
