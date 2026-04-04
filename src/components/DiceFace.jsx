const DOT_MAP = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export default function DiceFace({ value, selectedForReroll, inRerollMode, onClick, disabled }) {
  const dots = DOT_MAP[value] || [];
  const dotClass = value <= 3 ? 'die-dot die-dot-red' : 'die-dot die-dot-dark';
  const clickable = inRerollMode && !disabled;

  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      className={`relative transition-all duration-150 select-none
        ${clickable ? 'cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95' : 'cursor-default'}`}
      title={inRerollMode ? (selectedForReroll ? '点击取消选择' : '点击选择重掷') : undefined}
    >
      <div
        className="die-face"
        style={
          selectedForReroll
            ? {
                outline: '3px solid #eab308',
                outlineOffset: '3px',
                boxShadow:
                  '0 0 14px 4px rgba(234,179,8,0.6), inset -4px -4px 10px rgba(0,0,0,0.35), inset 2px 2px 6px rgba(255,255,255,0.9), 0 6px 16px rgba(0,0,0,0.7)',
              }
            : undefined
        }
      >
        {Array.from({ length: 9 }, (_, idx) => {
          const row = Math.floor(idx / 3);
          const col = idx % 3;
          return (
            <div key={idx} className="flex items-center justify-center">
              {dots.some(([r, c]) => r === row && c === col) && <div className={dotClass} />}
            </div>
          );
        })}
      </div>
      {selectedForReroll && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center z-10 shadow">
          <span className="text-[9px] text-black font-black">✓</span>
        </div>
      )}
    </button>
  );
}
