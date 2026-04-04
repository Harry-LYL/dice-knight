import { useGame } from '../context/GameContext';

export default function HpBar() {
  const { state } = useGame();
  const { hp, maxHp, armor, permanentArmor } = state;
  const ratio = Math.max(0, hp / maxHp);
  const low = ratio <= 0.3;
  const color = low ? '#ff4040' : ratio <= 0.6 ? '#e8a020' : '#e8e8e8';

  return (
    <div className="flex items-end gap-4">
      {armor > 0 && (
        <div className="flex flex-col items-center gap-0.5 mb-1">
          <span className="text-xl leading-none">🛡</span>
          <span className="text-sm font-bold text-[#a0c4ff]">{armor}</span>
          {permanentArmor && <span className="text-[8px] text-[#5566aa] tracking-wider">永久</span>}
        </div>
      )}
      <div className="flex flex-col items-end">
        <span className="text-[11px] text-[#555] tracking-wider mb-0.5">生命值</span>
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-black leading-none transition-colors duration-500"
            style={{
              fontSize: '3.2rem',
              color,
              fontFamily: 'Cinzel, serif',
              textShadow: low ? `0 0 20px ${color}88` : 'none',
            }}
          >
            {hp}
          </span>
          <span className="text-base text-[#333] font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
            / {maxHp}
          </span>
        </div>
      </div>
    </div>
  );
}
