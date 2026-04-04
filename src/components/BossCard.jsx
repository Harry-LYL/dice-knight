import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { canAttackBoss } from '../utils/dice';

export default function BossCard({ boss }) {
  const { state, act } = useGame();
  const { phase, detectedHands, attackingBossId } = state;
  const [shaking, setShaking] = useState(false);
  const [dying, setDying] = useState(false);
  const [hidden, setHidden] = useState(false);

  const canAttack = phase === 'selecting' && canAttackBoss(detectedHands, boss.hand);
  const isBeingAttacked = attackingBossId === boss.id;

  useEffect(() => {
    if (isBeingAttacked) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 450);
      return () => clearTimeout(t);
    }
  }, [isBeingAttacked]);

  useEffect(() => {
    if (!boss.alive && !hidden) {
      setDying(true);
      const t = setTimeout(() => setHidden(true), 1100);
      return () => clearTimeout(t);
    }
  }, [boss.alive, hidden]);

  if (hidden) return <div className="flex-1" />;

  function handleClick() {
    if (canAttack) act('ATTACK_BOSS', { bossId: boss.id });
  }

  function handleEnter() {
    if (phase === 'selecting' || phase === 'idle') act('SET_HOVER_BOSS', { bossFileName: boss.fileName });
  }

  function handleLeave() {
    if (phase !== 'boss-attacking') act('SET_HOVER_BOSS', { bossFileName: null });
  }

  const hearts = Array.from({ length: boss.hitsRequired });

  return (
    <div
      className={`flex-1 flex flex-col items-center gap-1.5 cursor-default select-none
        ${dying ? 'animate-card-death' : ''}
        ${shaking ? 'animate-card-shake' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        onClick={handleClick}
        className={`relative w-full aspect-[3/4] overflow-hidden transition-all duration-200 rounded-lg
          ${canAttack ? 'cursor-pointer animate-border-scan hover:scale-105 ring-1 ring-white' : 'ring-1 ring-[#2a2a2a]'}
        `}
        style={{ background: '#111' }}
      >
        <img
          src={`/assets/cards/${boss.fileName}.JPG`}
          alt={boss.name}
          className="w-full h-full object-cover grayscale"
          style={{ objectPosition: boss.imagePosition || 'center top' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        {canAttack && (
          <div
            className="absolute inset-x-0 bottom-0 flex items-center justify-center py-2"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85) 40%)' }}
          >
            <span
              className="text-white text-sm font-bold tracking-widest"
              style={{ textShadow: '0 0 8px rgba(255,255,255,0.6)' }}
            >
              ⚔ 点击攻击
            </span>
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 bg-black/90 rounded px-1.5 py-0.5 flex flex-col items-center leading-none">
          <span className="text-[7px] text-[#888] tracking-wider">ATK</span>
          <span className="text-[14px] font-black text-red-400">{boss.atk}</span>
        </div>
      </div>
      <p className="text-sm font-bold text-[#ddd] tracking-wide leading-tight">{boss.name}</p>
      <div className="flex items-center gap-0.5">
        <span className="text-[9px] text-[#555] mr-0.5">生命</span>
        {hearts.map((_, i) => (
          <span
            key={i}
            className={`text-sm leading-none transition-all duration-300 ${i < boss.hitsLeft ? 'text-[#e53e3e]' : 'text-[#2a2a2a]'}`}
          >
            ♥
          </span>
        ))}
      </div>
      <div className="text-center">
        <p className="text-[11px] text-[#666] font-semibold">{boss.handLabel}</p>
        <p className="text-[9px] text-[#444] leading-tight">{boss.handDesc}</p>
      </div>
    </div>
  );
}
