import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function RollAnimation() {
  const { act } = useGame();
  const done = useRef(false);
  const [fading, setFading] = useState(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setFading(true);
    setTimeout(() => act('FINISH_ROLL'), 450);
  }, [act]);

  useEffect(() => {
    const t = setTimeout(finish, 1800);
    return () => clearTimeout(t);
  }, [finish]);

  return (
    <motion.div
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <video
        src={`${import.meta.env.BASE_URL}assets/roll.mp4`}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={finish}
      />
    </motion.div>
  );
}
