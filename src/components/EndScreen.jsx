import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const DEFEAT_SLIDES = [
  { src: `${import.meta.env.BASE_URL}assets/defeat/defeat1.JPG`, duration: 1000 },
  { src: `${import.meta.env.BASE_URL}assets/defeat/defeat2.JPG`, duration: 1000 },
  { src: null, duration: null },
];

function DefeatSlideshow({ onDone }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const slide = DEFEAT_SLIDES[idx];
    if (!slide?.duration) { onDone(); return; }
    const t = setTimeout(() => setIdx((i) => i + 1), slide.duration + 400);
    return () => clearTimeout(t);
  }, [idx, onDone]);

  const slide = DEFEAT_SLIDES[idx];
  if (!slide?.src) return null;

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={slide.src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <img src={slide.src} alt="" className="w-full h-full object-cover" />
      </motion.div>
    </AnimatePresence>
  );
}

export default function EndScreen({ type }) {
  const { act } = useGame();
  const isVictory = type === 'victory';
  const [showUI, setShowUI] = useState(isVictory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-10 select-none overflow-hidden"
    >
      {!isVictory && !showUI && <DefeatSlideshow onDone={() => setShowUI(true)} />}
      <AnimatePresence>
        {showUI && (
          <motion.div
            key="ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-10 z-10 text-center px-8"
          >
            <div className="absolute inset-6 border border-[#1a1a1a] pointer-events-none" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-[#444] text-xs tracking-[0.4em] uppercase">
                {isVictory ? 'Victory' : 'Defeat'}
              </p>
              <h1
                className="text-5xl font-black text-white leading-none"
                style={{
                  fontFamily: 'Cinzel, serif',
                  textShadow: isVictory
                    ? '0 0 40px rgba(255,215,0,0.3)'
                    : '0 0 40px rgba(180,0,0,0.3)',
                }}
              >
                {isVictory ? '古堡已光复' : '勇者已倒下'}
              </h1>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#555] to-transparent" />
              <p className="text-[#666] text-sm max-w-xs leading-relaxed">
                {isVictory
                  ? '五位黑暗领主已被击败，古堡重归光明。传说将永远铭记你的名字。'
                  : '黑暗再次笼罩古堡。但勇者的故事，从未真正结束。'}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => act('START_GAME')}
                className="px-10 py-3 bg-white text-black text-xs tracking-[0.3em] uppercase
                  hover:bg-[#ddd] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                再次挑战
              </button>
              <button
                onClick={() => act('RESET')}
                className="px-8 py-3 bg-[#1a1a1a] text-[#666] text-xs tracking-[0.3em] uppercase
                  hover:bg-[#222] hover:text-[#999] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                返回首页
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
