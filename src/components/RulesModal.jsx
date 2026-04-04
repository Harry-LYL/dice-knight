const FONT = "'Microsoft YaHei', '微软雅黑', sans-serif";

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-[#888] text-xs tracking-[0.25em] uppercase mb-3 flex items-center gap-2">
        <span className="text-sm">{title}</span>
      </h3>
      <div className="text-[#888] leading-relaxed">{children}</div>
    </div>
  );
}

export default function RulesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: FONT }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0d0d0d] border-b border-[#222] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-white text-lg font-bold tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
            ✦ 游戏规则 ✦
          </h2>
          <button onClick={onClose} className="text-[#555] hover:text-white text-xl cursor-pointer transition-colors leading-none">
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-6">
          <Section title="🎯 游戏目标">
            <p className="text-[#aaa] text-sm leading-relaxed">
              击败所有 <span className="text-white font-bold">5 位 Boss</span>，生命值归零则失败。
            </p>
          </Section>

          <Section title="🔄 回合流程">
            <ol className="space-y-2 text-sm text-[#aaa]">
              {[
                ['掷骰', '点击「掷骰」按钮，投出 5 颗骰子'],
                ['重骰', '点击「重新抛骰子」，选择要重掷的骰子（每回合最多 2 次）'],
                ['行动', '攻击 Boss 或选择防御/治疗效果'],
                ['敌人回合', '所有存活 Boss 依次攻击玩家'],
              ].map(([label, desc], i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#2a2a2a] border border-[#444] flex items-center justify-center text-xs text-[#888] font-bold">
                    {i + 1}
                  </span>
                  <span>
                    <span className="text-white font-semibold">{label}：</span>
                    {desc}
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="🎲 骰子组合与行动">
            <p className="text-xs text-[#555] mb-3">每种组合可攻击对应 Boss，或选择防御效果（二选一）</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#333]">
                    <th className="text-left py-2 px-2 text-[#888] font-semibold w-[22%]">组合</th>
                    <th className="text-left py-2 px-2 text-[#888] font-semibold w-[28%]">示例点数</th>
                    <th className="text-left py-2 px-2 text-[#f4a261] font-semibold w-[22%]">⚔ 攻击</th>
                    <th className="text-left py-2 px-2 text-[#a0c4ff] font-semibold w-[28%]">🛡 防御效果</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['对子', '任意 2 个相同', '石魔鬼', '+5 护甲', 'text-[#a0c4ff]'],
                    ['顺子', '1-2-3-4-5 连续', '幻术师', '+8 护甲', 'text-[#a0c4ff]'],
                    ['三条', '任意 3 个相同', '三头龙', '+2 HP', 'text-[#90ee90]'],
                    ['葫芦', '3 同 + 2 同', '国王', '+4 HP', 'text-[#90ee90]'],
                    ['四条', '任意 4 个相同', '国王', '+3 HP', 'text-[#90ee90]'],
                    ['五条', '5 个全相同', '星灵', '+5 HP', 'text-[#90ee90]'],
                  ].map(([hand, example, boss, def, cls]) => (
                    <tr key={hand} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                      <td className="py-2.5 px-2 text-white font-bold text-base">{hand}</td>
                      <td className="py-2.5 px-2 text-[#666] text-xs">{example}</td>
                      <td className="py-2.5 px-2 text-[#f4a261] font-semibold">{boss}</td>
                      <td className={`py-2.5 px-2 font-semibold ${cls}`}>{def}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="🏆 击败 Boss 奖励">
            <div className="space-y-2">
              {[
                ['🧌', '石魔鬼', '立即回复 3 HP'],
                ['🧙', '幻术师', '永久解锁第三次重骰'],
                ['🐉', '三头龙', '最大 HP +3'],
                ['👑', '国王', '护甲永久保留（不会回合重置）'],
                ['🌟', '星灵', '立即满血回复'],
              ].map(([emoji, name, reward]) => (
                <div key={name} className="flex items-center gap-3 bg-[#111] rounded-lg px-3 py-2">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-white font-semibold text-sm w-14 shrink-0">{name}</span>
                  <span className="text-[#ffd700] text-sm">{reward}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="👾 Boss 属性一览">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#333]">
                  <th className="text-left py-2 px-2 text-[#888] font-semibold">Boss</th>
                  <th className="text-left py-2 px-2 text-[#888] font-semibold">需要牌型</th>
                  <th className="text-center py-2 px-2 text-[#888] font-semibold">攻击力</th>
                  <th className="text-center py-2 px-2 text-[#888] font-semibold">需击败次数</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['🧌 石魔鬼', '对子', 2, 2],
                  ['🧙 幻术师', '顺子', 1, 3],
                  ['👑 国王', '四条/葫芦', 2, 3],
                  ['🌟 星灵', '五条', 4, 1],
                  ['🐉 三头龙', '三条', 3, 2],
                ].map(([name, hand, atk, hits]) => (
                  <tr key={name} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                    <td className="py-2.5 px-2 text-white font-semibold">{name}</td>
                    <td className="py-2.5 px-2 text-[#ccc]">{hand}</td>
                    <td className="py-2.5 px-2 text-center text-red-400 font-bold">{atk}</td>
                    <td className="py-2.5 px-2 text-center text-[#aaa]">{'♥'.repeat(hits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
      </div>
    </div>
  );
}
