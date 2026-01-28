'use client';

import { VocabGrouped } from '@/lib/types';
import VocabCard from './VocabCard';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface VocabGridProps {
  entries: VocabGrouped;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export default function VocabGrid({ entries, onUpdate, onDelete }: VocabGridProps) {
  const dates = Object.keys(entries).sort((a, b) => b.localeCompare(a));

  if (dates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 sm:py-20"
      >
        <div className="bg-white rounded-2xl p-10 sm:p-12 inline-block border border-gray-200 shadow-sm">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            开始你的词汇学习之旅
          </h3>
          <p className="text-gray-500">
            使用上方的输入框添加单词或句子
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {dates.map((date, dateIndex) => (
        <div key={date} className="contents">
          {/* Date header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: dateIndex * 0.1 }}
            className="col-span-full mb-3 sm:mb-4 mt-8 sm:mt-10 first:mt-0"
          >
            <h2 className="text-2xl font-bold text-gradient">
              {format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN })}
            </h2>
            <p className="text-sm text-gray-400 mt-1.5">
              {entries[date].length} 个词条
            </p>
          </motion.div>

          {/* Vocab cards for this date */}
          {entries[date].map((entry, entryIndex) => {
            // Bento Grid logic: long sentences span 2 columns
            const isLong = entry.content.length > 20;
            const colSpan = isLong ? 'md:col-span-2' : '';

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: dateIndex * 0.1 + entryIndex * 0.05,
                  duration: 0.3,
                }}
                className={colSpan}
              >
                <VocabCard entry={entry} onUpdate={onUpdate} onDelete={onDelete} />
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
