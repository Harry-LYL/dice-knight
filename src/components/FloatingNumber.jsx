import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

export default function FloatingNumber({ id, text, color, left, bottom }) {
  const { act } = useGame();

  useEffect(() => {
    const t = setTimeout(() => act('REMOVE_FLOAT', { id }), 2100);
    return () => clearTimeout(t);
  }, [id, act]);

  const isBigDmg = /^-\d+$/.test(text) && parseInt(text.slice(1)) >= 5;
  const isDmg = /^-\d+$/.test(text);

  return (
    <div
      className="animate-float-up pointer-events-none select-none font-black"
      style={{
        position: 'absolute',
        color,
        fontSize: isBigDmg ? '2.4rem' : isDmg ? '1.8rem' : '1.3rem',
        textShadow: `0 0 14px ${color}99, 0 2px 4px rgba(0,0,0,0.8)`,
        whiteSpace: 'nowrap',
        zIndex: 999,
        left: `${left ?? 60}%`,
        bottom: `${bottom ?? 40}%`,
        transform: 'translateX(-50%)',
        fontFamily: "'Microsoft YaHei', '微软雅黑', 'PingFang SC', sans-serif",
        letterSpacing: '0.05em',
      }}
    >
      {text}
    </div>
  );
}
