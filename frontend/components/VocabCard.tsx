'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VocabEntry } from '@/lib/types';
import { vocabApi } from '@/lib/api';

interface VocabCardProps {
  entry: VocabEntry;
  onUpdate?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function VocabCard({ entry, onUpdate, onDelete, className = '' }: VocabCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [analysis, setAnalysis] = useState(entry.aiAnalysis);

  const handleClick = async () => {
    if (!isExpanded && !analysis) {
      // Trigger AI analysis on first expand
      setIsAnalyzing(true);
      try {
        const result = await vocabApi.analyze(entry.id);
        setAnalysis(result.aiAnalysis);
        onUpdate?.();
      } catch (error) {
        console.error('AI analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片展开

    if (!confirm('确定要删除这个词条吗？')) {
      return;
    }

    setIsDeleting(true);
    try {
      await vocabApi.delete(entry.id);
      onDelete?.();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to parse sentence with translation
  const parseSentence = (sentence: string) => {
    // Check if sentence contains common separators
    const separators = [' | ', ' - ', '｜', '—', ' - '];
    for (const sep of separators) {
      if (sentence.includes(sep)) {
        const parts = sentence.split(sep);
        return { en: parts[0].trim(), zh: parts[1]?.trim() || '' };
      }
    }
    return { en: sentence, zh: '' };
  };

  const CipherLoader = () => (
    <div className="flex flex-col items-center gap-4 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex items-center gap-2 text-sm text-orange-600"
      >
        <span>AI 正在分析中...</span>
      </motion.div>
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
      className={className}
    >
      <motion.div
        layout
        onClick={handleClick}
        whileHover={{ y: -2 }}
        className={`
          relative overflow-hidden rounded-xl px-8 py-6 cursor-pointer
          bg-white
          border border-gray-200
          transition-all duration-300
          hover:shadow-lg hover:shadow-orange-100
          hover:border-orange-200
        `}
      >
        {/* Content */}
        <motion.div layout="position" className="relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                {entry.content}
              </h3>
              {/* Show translation in collapsed state */}
              {!isExpanded && (entry.translation || analysis?.cn) && (
                <p className="text-base text-gray-600 mb-2">
                  {entry.translation || analysis?.cn}
                </p>
              )}
              {entry.pos && (
                <span className="inline-block px-3 py-1 text-xs font-mono rounded-full bg-orange-50 border border-orange-200 text-orange-600">
                  {entry.pos}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Delete button */}
              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="删除"
              >
                {isDeleting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full"
                  />
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                )}
              </motion.button>

              {/* Expand/Collapse button */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 text-gray-400"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"
              />

              {isAnalyzing ? (
                <CipherLoader />
              ) : analysis ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  {/* Translation */}
                  {analysis.cn && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="bg-orange-50 rounded-xl p-4 border border-orange-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📖</span>
                        <p className="text-sm font-medium text-orange-700">中文释义</p>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{analysis.cn}</p>
                    </motion.div>
                  )}

                  {/* Etymology */}
                  {analysis.etymology && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🔍</span>
                        <p className="text-sm font-medium text-gray-700">词源/词根</p>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{analysis.etymology}</p>
                    </motion.div>
                  )}

                  {/* Sentences */}
                  {analysis.sentences && analysis.sentences.length > 0 && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">✨</span>
                        <p className="text-sm font-medium text-gray-700">例句</p>
                      </div>
                      <ul className="space-y-3">
                        {analysis.sentences.map((sentence, i) => {
                          const { en, zh } = parseSentence(sentence);
                          return (
                            <motion.li
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 + i * 0.1 }}
                              className="text-sm pl-4 border-l-2 border-orange-300 leading-relaxed"
                            >
                              <p className="text-gray-800 font-medium mb-1">{en}</p>
                              {zh && <p className="text-gray-500">{zh}</p>}
                            </motion.li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}

                  {/* Tips */}
                  {analysis.tips && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💡</span>
                        <p className="text-sm font-semibold text-orange-700">记忆技巧</p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{analysis.tips}</p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-500">点击使用AI分析</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
