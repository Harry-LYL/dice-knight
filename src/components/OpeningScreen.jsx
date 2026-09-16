import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const FADE_MS = 800;
const HOLD_MS = 3000;

export default function OpeningScreen() {
  const { act } = useGame();
  const [op1, setOp1] = useState(0);
  const [op2, setOp2] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setOp1(1), 50);
    const t2 = setTimeout(() => { setOp1(0); setOp2(1); }, FADE_MS + HOLD_MS);
    const t3 = setTimeout(() => setOp2(0), FADE_MS + HOLD_MS + FADE_MS + HOLD_MS);
    const t4 = setTimeout(() => act('OPEN_ANIM_DONE'), FADE_MS + HOLD_MS + FADE_MS + HOLD_MS + FADE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [act]);

  return (
    <div className="fixed inset-0 z-50 bg-black cursor-pointer" onClick={() => act('OPEN_ANIM_DONE')}>
      <img
        src={`${import.meta.env.BASE_URL}assets/opening2.jpg`}
        alt="opening2"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: op1, transition: `opacity ${FADE_MS}ms ease` }}
      />
      <img
        src={`${import.meta.env.BASE_URL}assets/opening.jpg`}
        alt="opening"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: op2, transition: `opacity ${FADE_MS}ms ease` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      <p className="absolute bottom-12 left-0 right-0 text-center text-[#666] text-xs tracking-widest animate-pulse pointer-events-none">
        点击任意处跳过
      </p>
    </div>
  );
}
