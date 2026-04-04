import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { HAND_RANKINGS, DEFENSE_DATA } from '../data/bosses';
import DiceFace from './DiceFace';

const DICE_X = [2, 17, 35, 53, 68];
const FONT = "'Microsoft YaHei', '微软雅黑', sans-serif";

function randomDiePos(index, prev) {
  const rot = (Math.random() - 0.5) * 28;
  const rotStart = rot + (Math.random() > 0.5 ? 150 : -150) + (Math.random() - 0.5) * 40;
  return {
    x: DICE_X[index] + (Math.random() - 0.5) * 7,
    y: 8 + Math.random() * 44,
    rot,
    rotStart,
    animKey: (prev?.animKey ?? 0) + 1,
  };
}

export default function DicePanel({ onRollClick }) {
  const { state, act } = useGame();
  const { phase, dice, lockedDice, rerollsUsed, maxRerolls, detectedHands, hasRolled } = state;

  const [positions, setPositions] = useState(null);
  const [rerollMode, setRerollMode] = useState(false);
  const [rerollSelection, setRerollSelection] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (!hasRolled) { setPositions(null); return; }
    setPositions((prev) =>
      dice.map((_, i) => (prev && lockedDice[i] ? prev[i] : randomDiePos(i, prev?.[i])))
    );
  }, [dice]);

  useEffect(() => {
    if (phase !== 'selecting') {
      setRerollMode(false);
      setRerollSelection([false, false, false, false, false]);
    }
  }, [phase]);

  const isSelecting = phase === 'selecting';
  const canReroll = isSelecting && rerollsUsed < maxRerolls;
  const bestHand = detectedHands[0];
  const handInfo = bestHand ? HAND_RANKINGS[bestHand] : null;
  const defenseInfo = bestHand ? DEFENSE_DATA[bestHand] : null;

  function startReroll() {
    setRerollSelection([false, false, false, false, false]);
    setRerollMode(true);
  }

  function toggleRerollDie(i) {
    setRerollSelection((s) => s.map((v, idx) => (idx === i ? !v : v)));
  }

  function confirmReroll() {
    act('SET_LOCKS', { lockedDice: rerollSelection.map((s) => !s) });
    setRerollMode(false);
    setRerollSelection([false, false, false, false, false]);
    onRollClick();
  }

  function cancelReroll() {
    setRerollMode(false);
    setRerollSelection([false, false, false, false, false]);
  }

  const anySelected = rerollSelection.some(Boolean);

  return (
    <>
      {rerollMode && <div className="fixed inset-0 z-40 bg-black/75" onClick={cancelReroll} />}
      <div
        className="flex flex-col gap-3 w-full"
        style={{ position: rerollMode ? 'relative' : undefined, zIndex: rerollMode ? 50 : undefined }}
      >
        {/* Dice area */}
        <div className="relative w-full overflow-hidden" style={{ height: '190px' }}>
          {rerollMode && (
            <div className="absolute top-1 left-0 right-0 text-center z-10 pointer-events-none">
              <span
                className="text-yellow-300 text-xs tracking-widest px-3 py-1 rounded-full bg-black/70"
                style={{ fontFamily: FONT }}
              >
                请点击选择需要重新抛掷的骰子
              </span>
            </div>
          )}
          {hasRolled && positions
            ? dice.map((val, i) => {
                const pos = positions[i];
                if (!pos) return null;
                const sel = rerollMode && rerollSelection[i];
                return (
                  <motion.div
                    key={`die-${i}-${pos.animKey}`}
                    style={{
                      position: 'absolute',
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      zIndex: rerollMode ? 10 : undefined,
                    }}
                    initial={{ y: -100, rotate: pos.rotStart, scale: 1.5, opacity: 0 }}
                    animate={{ y: 0, rotate: pos.rot, scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      damping: 11,
                      stiffness: 180,
                      delay: i * 0.055,
                      opacity: { duration: 0.08, delay: i * 0.055 },
                    }}
                  >
                    <DiceFace
                      value={val}
                      selectedForReroll={sel}
                      inRerollMode={rerollMode}
                      disabled={!isSelecting && !rerollMode}
                      onClick={rerollMode ? () => toggleRerollDie(i) : undefined}
                    />
                  </motion.div>
                );
              })
            : DICE_X.map((x, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${x}%`, top: `${20 + (i % 2) * 12}%`, transform: `rotate(${(i - 2) * 4}deg)` }}
                >
                  <DiceFace value={i + 1} inRerollMode={false} disabled />
                </div>
              ))}
        </div>

        {/* Reroll confirm buttons */}
        {rerollMode && (
          <div className="flex gap-3 justify-center" style={{ zIndex: 50 }}>
            <button
              onClick={cancelReroll}
              className="px-5 py-2 bg-[#1a1a1a] text-[#666] text-sm rounded-lg cursor-pointer hover:bg-[#222] hover:text-[#999] transition-all"
              style={{ fontFamily: FONT }}
            >
              取消
            </button>
            <button
              onClick={confirmReroll}
              disabled={!anySelected}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer
                ${anySelected ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg' : 'bg-[#2a2a2a] text-[#444] cursor-not-allowed'}`}
              style={{ fontFamily: FONT }}
            >
              确认重掷（已选 {rerollSelection.filter(Boolean).length} 颗）
            </button>
          </div>
        )}

        {/* Hand display */}
        {isSelecting && !rerollMode && (
          <div className="text-center">
            {handInfo ? (
              <div
                className="text-3xl font-black tracking-widest text-white"
                style={{ fontFamily: FONT, textShadow: '0 0 20px rgba(255,255,255,0.4)' }}
              >
                {handInfo.label}
              </div>
            ) : (
              <div className="text-lg text-[#333] tracking-widest" style={{ fontFamily: FONT }}>
                — 无有效牌型 —
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {isSelecting && !rerollMode && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-[11px] text-[#555] tracking-[0.2em]" style={{ fontFamily: FONT }}>
              选择你的行动
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {canReroll && (
                <button
                  onClick={startReroll}
                  className="px-5 py-2 bg-[#2a2a2a] text-[#ccc] text-xs tracking-[0.2em] rounded-lg
                    hover:bg-[#3a3a3a] hover:text-white transition-all duration-200 cursor-pointer"
                  style={{ fontFamily: FONT }}
                >
                  重新抛骰子（本回合剩余 {maxRerolls - rerollsUsed} 次）
                </button>
              )}
              {bestHand && defenseInfo && (
                <button
                  onClick={() => act('DEFEND', { hand: bestHand })}
                  className="px-5 py-2 bg-[#1a2a3a] text-[#a0c4ff] text-xs tracking-[0.2em] rounded-lg
                    hover:bg-[#1e3048] transition-all duration-200 cursor-pointer"
                  style={{ fontFamily: FONT }}
                >
                  防御 · {defenseInfo.label}
                </button>
              )}
              {bestHand && (
                <div
                  className="w-full text-center text-[11px] text-[#555] tracking-wider mt-1"
                  style={{ fontFamily: FONT }}
                >
                  ↑ 点击上方高亮卡牌发动攻击
                </div>
              )}
              {!bestHand && !canReroll && (
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => act('DEFEND', { hand: null })}
                    className="px-5 py-2 bg-[#1a1a1a] text-[#555] text-xs tracking-widest rounded-lg
                      cursor-pointer hover:bg-[#222] hover:text-[#888] transition-all duration-200"
                    style={{ fontFamily: FONT }}
                  >
                    跳过回合
                  </button>
                  <span className="text-[9px] text-[#333] tracking-wider" style={{ fontFamily: FONT }}>
                    敌人仍会攻击
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roll button (idle phase) */}
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onRollClick}
              className="px-12 py-4 bg-white text-black text-xl font-black rounded-lg
                hover:bg-[#f0f0f0] active:scale-95 transition-all duration-150 cursor-pointer shadow-xl"
              style={{ fontFamily: FONT, letterSpacing: '0.25em' }}
            >
              掷  骰
            </button>
            <p className="text-[11px] text-[#333] tracking-wider" style={{ fontFamily: FONT }}>
              投掷 5 枚骰子开始本回合
            </p>
          </div>
        )}
      </div>
    </>
  );
}
