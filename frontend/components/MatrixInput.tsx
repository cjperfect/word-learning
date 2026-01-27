'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface MatrixInputProps {
  onSave: (content: string) => Promise<void>;
}

export default function MatrixInput({ onSave }: MatrixInputProps) {
  const [inputs, setInputs] = useState<string[]>(Array(8).fill(''));
  const controls = useAnimation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update active input index
  const activeIndex = inputs.findIndex((i) => i === '');

  const handleInputChange = async (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleKeyDown = async (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Space - auto skip to next input
    if (e.code === 'Space' && inputs[index].trim()) {
      e.preventDefault();
      const nextIndex = index + 1;

      if (nextIndex < 8) {
        // Trigger pulse animation on current input
        await controls.start({
          scale: [1, 0.95, 1],
          borderColor: ['#ffffff20', '#60a5fa', '#ffffff20'],
          transition: { duration: 0.3 },
        });

        // Focus next input
        inputRefs.current[nextIndex]?.focus();
      }
    }

    // Enter - batch save
    if (e.code === 'Enter') {
      await handleBatchSave();
    }

    // Backspace - go to previous input if current is empty
    if (e.code === 'Backspace' && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBatchSave = async () => {
    const content = inputs.filter((i) => i.trim()).join(' ');

    if (!content.trim()) return;

    await onSave(content);

    // Reset inputs
    setInputs(Array(8).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 mb-12">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          词汇流 AI 2.0
        </h1>
        <p className="text-gray-500 text-sm">输入单词 • 按空格键 • 按回车键保存</p>
      </motion.div>

      {/* Matrix Input */}
      <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl">
        {inputs.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="relative flex-1 min-w-[80px]"
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder={index === activeIndex ? '输入...' : ''}
              className={`
                w-full px-4 py-3 text-gray-800 text-center text-lg
                bg-white border-b-2 outline-none
                transition-all duration-200
                ${index === activeIndex
                  ? 'border-orange-400 focus:border-orange-500'
                  : 'border-gray-200 focus:border-gray-300'
                }
                placeholder:text-gray-300
              `}
            />
            {index === activeIndex && (
              <motion.div
                layoutId="active-input"
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-orange-400"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-6 text-sm text-gray-400"
      >
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">空格</kbd>
          <span>下一个</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">回车</kbd>
          <span>保存</span>
        </div>
      </motion.div>
    </div>
  );
}
