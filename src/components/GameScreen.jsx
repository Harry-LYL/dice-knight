import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import LeftPanel from './LeftPanel';
import BossCard from './BossCard';
import DicePanel from './DicePanel';
import HpBar from './HpBar';
import FloatingNumber from './FloatingNumber';
import RollAnimation from './RollAnimation';
import RulesModal from './RulesModal';

export default function GameScreen() {
  const { state, act } = useGame();
  const { phase, floatingNumbers, pageShaking, bosses, attackingBossId } = state;

  const [showRules, setShowRules] = useState(false);
  const [showRollAnim, setShowRollAnim] = useState(false);
  const [shakeClass, setShakeClass] = useState('');
  const [phaseLabel, setPhaseLabel] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 4200);
    return () => clearTimeout(t);
  }, []);

  const videoEndCb = useRef(null);
  const bossQueue = useRef([]);
  const timers = useRef([]);

  function startBossAttackQueue() {
    const queue = bossQueue.current;
    if (queue.length === 0) return;
    const [current, ...rest] = queue;
    bossQueue.current = rest;
    const boss = bosses.find((b) => b.id === current);
    if (boss) act('SET_LEFT_PANEL', { mode: 'boss-attack', fileName: boss.fileName });
    videoEndCb.current = () => {
      if (boss) act('APPLY_BOSS_DAMAGE', { bossId: current });
      act('SET_LEFT_PANEL', { mode: 'default', fileName: null });
      if (rest.length > 0) {
        setTimeout(() => startBossAttackQueue(), 400);
      } else {
        videoEndCb.current = null;
        act('BOSS_ATTACK_DONE');
      }
    };
  }

  function handleVideoEnd() {
    videoEndCb.current?.();
  }

  // Page shake
  useEffect(() => {
    if (pageShaking) {
      setShakeClass('animate-page-shake');
      const t = setTimeout(() => {
        setShakeClass('');
        act('CLEAR_PAGE_SHAKE');
      }, 600);
      return () => clearTimeout(t);
    }
  }, [pageShaking, act]);

  // Phase label
  useEffect(() => {
    setPhaseLabel(
      phase === 'idle' ? '掷骰阶段' : phase === 'selecting' ? '选择行动' : phase === 'boss-attacking' ? '敌人回合' : ''
    );
  }, [phase]);

  function beginPlayerTurnEnd() {
    timers.current.forEach(clearTimeout);
    setAnnouncement('玩家回合结束');
    timers.current = [
      setTimeout(() => setAnnouncement('敌人回合开始'), 1500),
      setTimeout(() => {
        setAnnouncement('');
        startBossAttackQueue();
      }, 3000),
    ];
  }

  // Boss attacking phase
  useEffect(() => {
    if (phase !== 'boss-attacking') return;
    const alive = bosses.filter((b) => b.alive);
    if (alive.length === 0) {
      act('BOSS_ATTACK_DONE');
      return;
    }
    bossQueue.current = alive.map((b) => b.id);

    const { leftPanelMode } = state;
    if (leftPanelMode === 'boss-hurt' && attackingBossId) {
      const boss = bosses.find((b) => b.id === attackingBossId);
      const killed = boss && !boss.alive;
      setAnnouncement(`正在攻击 ${boss?.name ?? ''}`);
      videoEndCb.current = () => {
        videoEndCb.current = null;
        if (killed && boss) {
          setAnnouncement(`⚔ ${boss.name} 被打败！`);
          const t = setTimeout(() => {
            setAnnouncement('');
            beginPlayerTurnEnd();
          }, 2200);
          timers.current.push(t);
        } else {
          beginPlayerTurnEnd();
        }
      };
    } else {
      beginPlayerTurnEnd();
    }

    return () => { timers.current.forEach(clearTimeout); };
  }, [phase]);

  function handleRollClick() {
    setShowRollAnim(true);
    act('START_ROLL_ANIM');
  }

  useEffect(() => {
    if (phase === 'selecting') setShowRollAnim(false);
  }, [phase]);

  const corners = [
    'top-0 left-0',
    'top-0 right-0 scale-x-[-1]',
    'bottom-0 left-0 scale-y-[-1]',
    'bottom-0 right-0 scale-x-[-1] scale-y-[-1]',
  ];

  return (
    <div className={`medieval-bg relative w-full h-full flex flex-col overflow-hidden ${shakeClass}`}>
      {/* Corner ornaments */}
      {corners.map((cls, i) => (
        <div key={i} className={`absolute ${cls} pointer-events-none z-20`} style={{ width: 48, height: 48 }}>
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M2 2 L20 2 L20 4 L4 4 L4 20 L2 20 Z" fill="#2a2a2a" />
            <path d="M2 2 L8 2 L8 3 L3 3 L3 8 L2 8 Z" fill="#444" />
            <circle cx="11" cy="11" r="1.5" fill="#333" />
          </svg>
        </div>
      ))}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-[#1e1e1e] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#444] text-xs">✦</span>
          <span className="text-[10px] text-[#333] tracking-[0.4em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Dice Knight
          </span>
          <span className="text-[#444] text-xs">✦</span>
        </div>
        <span className="text-[11px] text-[#666] tracking-widest">{phaseLabel}</span>
        <div className="w-20" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left panel */}
        <div className="w-[40%] h-full shrink-0 relative">
          <LeftPanel onVideoEnd={handleVideoEnd} />
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden border-l border-[#1e1e1e]">
          {/* Boss cards */}
          <div className="flex gap-3 px-4 pt-3 pb-2 border-b border-[#1e1e1e]" style={{ minHeight: '185px' }}>
            {bosses.map((b) => (
              <BossCard key={b.id} boss={b} />
            ))}
          </div>

          <div className="ornament-divider px-6 py-1 shrink-0 text-[#2a2a2a]">✦</div>

          {/* Dice + actions + HP */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden">
              <DicePanel onRollClick={handleRollClick} />
            </div>
            <div className="flex items-end justify-between px-4 pb-3 shrink-0">
              <button
                onClick={() => setShowRules(true)}
                className="flex flex-col items-center gap-1 text-[#3a3a3a] hover:text-[#888] transition-colors cursor-pointer"
              >
                <span className="text-2xl leading-none">📜</span>
                <span className="text-[9px] tracking-widest text-[#333]">规则</span>
              </button>
              <HpBar />
            </div>
          </div>

          {/* Boss attacking overlay */}
          {phase === 'boss-attacking' && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 30%, rgba(180,0,0,0.12) 100%)',
                  animation: 'damage-flash 0.4s ease-in-out 2',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Announcement */}
      {announcement && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 50 }}>
          <div
            key={announcement}
            className="px-8 py-4 bg-black/80 text-white text-xl tracking-[0.3em] animate-float-up"
            style={{ fontFamily: "'Microsoft YaHei', '微软雅黑', sans-serif" }}
          >
            {announcement}
          </div>
        </div>
      )}

      {/* Floating numbers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 40 }}>
        {floatingNumbers.map((f) => (
          <FloatingNumber key={f.id} {...f} />
        ))}
      </div>

      {/* Roll animation overlay */}
      {showRollAnim && <RollAnimation />}

      {/* Rules modal */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      {/* Game intro overlay */}
      {showIntro && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 100, background: 'rgba(0,0,0,0.88)', animation: 'game-intro 4.2s ease forwards' }}
        >
          <style>{`
            @keyframes game-intro {
              0%   { opacity: 0; }
              10%  { opacity: 1; }
              75%  { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
          <p
            className="text-xs tracking-[0.6em] text-[#888] mb-4 uppercase"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Dice Knight · Castle War
          </p>
          <h1
            className="text-4xl font-black text-white text-center leading-snug"
            style={{
              fontFamily: "'Microsoft YaHei', '微软雅黑', sans-serif",
              letterSpacing: '0.12em',
              textShadow: '0 0 30px rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            用骰子击败城堡5大BOSS
          </h1>
          <div className="mt-5 w-40 h-px" style={{ background: 'linear-gradient(to right, transparent, #555, transparent)' }} />
        </div>
      )}
    </div>
  );
}
