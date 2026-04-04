import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PROB_TABLE, BOSS_DESIGNS } from '../data/bosses';

const FONT = "'Microsoft YaHei', '微软雅黑', sans-serif";

function Divider() {
  return <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#444] to-transparent mx-auto my-2" />;
}

function Badge({ children, dark }) {
  return (
    <span
      className={`inline-block text-[10px] tracking-[0.35em] uppercase font-bold px-3 py-1 rounded mb-4 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}
      style={{ fontFamily: FONT }}
    >
      {children}
    </span>
  );
}

function BossCarousel() {
  const [idx, setIdx] = useState(0);
  const b = BOSS_DESIGNS[idx];

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-0 bg-[#0d0d0d] border border-[#222] rounded-xl overflow-hidden">
        <div className="w-full md:w-56 shrink-0 bg-black flex items-center justify-center" style={{ minHeight: '280px' }}>
          <video key={b.fileName} src={`/assets/idle/${b.fileName}.mp4`} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ maxHeight: '320px' }} />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-white font-black text-2xl">{b.name}</span>
              <span className="text-xs px-3 py-1 rounded-full border font-semibold" style={{ borderColor: b.color, color: b.color }}>{b.role}</span>
            </div>
            <div className="flex gap-4 text-sm mb-5 text-[#666]">
              <span>需要牌型：<span className="text-white font-semibold">「{b.hand}」</span></span>
              <span>ATK：<span className="text-red-400 font-bold">{b.atk}</span></span>
              <span>需击败：<span className="text-white">{b.hits} 次</span></span>
            </div>
            <p className="text-[#888] text-sm leading-relaxed">{b.design}</p>
          </div>
          <div className="flex gap-2 mt-6">
            {BOSS_DESIGNS.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className="w-2 h-2 rounded-full transition-all cursor-pointer" style={{ background: i === idx ? b.color : '#2a2a2a' }} />
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => setIdx((i) => (i - 1 + BOSS_DESIGNS.length) % BOSS_DESIGNS.length)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-[#111] border border-[#2a2a2a] rounded-full flex items-center justify-center text-[#888] hover:text-white hover:border-[#444] transition-all cursor-pointer z-10 shadow-lg">‹</button>
      <button onClick={() => setIdx((i) => (i + 1) % BOSS_DESIGNS.length)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-[#111] border border-[#2a2a2a] rounded-full flex items-center justify-center text-[#888] hover:text-white hover:border-[#444] transition-all cursor-pointer z-10 shadow-lg">›</button>
      <p className="text-center text-[#444] text-xs mt-4" style={{ fontFamily: 'Cinzel, serif' }}>{idx + 1} / {BOSS_DESIGNS.length}</p>
    </div>
  );
}

export default function HomeScreen() {
  const { act } = useGame();

  return (
    <div className="w-full h-full overflow-y-auto bg-[#080808] text-white" style={{ fontFamily: FONT }}>
      {/* Hero */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-8 py-20 relative border-b border-[#1a1a1a]"
        style={{ backgroundImage: "url('/assets/opening.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#080808] pointer-events-none" />
        <div className="z-10 flex flex-col items-center gap-6 max-w-2xl">
          <p className="text-[10px] tracking-[0.5em] text-[#999] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>Game Design Portfolio · 游戏策划作品集</p>
          <h1 className="text-6xl font-black tracking-tight leading-none text-white" style={{ fontFamily: 'Cinzel, serif' }}>Dice Knight</h1>
          <p className="text-xl tracking-[0.4em] text-[#888]" style={{ fontFamily: 'Cinzel, serif' }}>Castle War</p>
          <Divider />
          <p className="text-[#bbb] text-sm tracking-[0.25em]">骰子骑士 · 古堡战争</p>
          <p className="text-[#aaa] text-base leading-relaxed max-w-md mt-2">
            以骰子牌型为核心驱动的<span className="text-white font-semibold">回合制策略游戏</span>。
            <br />五位黑暗领主盘踞古堡，以骰子为武器，击败所有邪恶势力。
          </p>
          <div className="flex gap-4 mt-4">
            <button onClick={() => act('SHOW_OPENING')} className="px-10 py-3.5 bg-white text-black text-sm font-bold tracking-[0.2em] rounded-lg hover:bg-[#eee] active:scale-95 transition-all cursor-pointer shadow-xl" style={{ fontFamily: FONT }}>立即试玩</button>
            <a href="#design" className="px-10 py-3.5 border border-[#666] text-[#ccc] text-sm tracking-[0.2em] rounded-lg hover:border-[#999] hover:text-white transition-all cursor-pointer flex items-center">查看设计思路 ↓</a>
          </div>
          <p className="text-[#777] text-xs tracking-widest mt-6" style={{ fontFamily: 'Cinzel, serif' }}>✦ DICE · STRATEGY · GLORY ✦</p>
          <p className="text-[#ccc] text-sm font-semibold tracking-[0.3em] mt-2" style={{ fontFamily: FONT }}>独立游戏作者：丛中笑</p>
        </div>
      </section>

      {/* Design sections */}
      <div id="design" className="bg-white text-gray-900" style={{ fontFamily: FONT }}>
        {/* How to play */}
        <section className="max-w-4xl mx-auto px-8 py-16 border-b border-gray-100">
          <Badge>How To Play · 游戏玩法</Badge>
          <h2 className="text-3xl font-black text-gray-900 mb-3">一分钟读懂游戏</h2>
          <p className="text-gray-500 text-sm mb-10">从未接触过的玩家，三步掌握核心循环。</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
            {[
              { step: '01', title: '掷骰子', desc: '每回合投出 5 颗骰子，系统自动识别你摇出的牌型（对子、顺子、三条……）。不满意可以重骰，每回合最多 2～3 次重骰机会。' },
              { step: '02', title: '选行动', desc: '用识别出的牌型攻击对应 Boss，或选择防御为自己回复 HP / 获得护甲。每个牌型只能选其一——攻还是守全靠你判断。' },
              { step: '03', title: 'Boss 反击', desc: '你行动结束后，所有存活的 Boss 依次对你发起攻击造成伤害。HP 归零即失败，在 HP 耗尽前打倒全部 5 位 Boss 即为胜利。' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-gray-50 rounded-xl p-6">
                <div className="text-4xl font-black text-gray-200 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{step}</div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 text-white rounded-xl p-6 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shrink-0">🏆</div>
            <div>
              <h3 className="font-black text-xl mb-2">怎么获胜？</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">城堡中有 <span className="text-white font-bold">5 位 Boss</span>，每位都需要特定牌型才能造成伤害，有的需打 <span className="text-white font-bold">1 次</span>，有的需打 <span className="text-white font-bold">3 次</span>才能击倒。</p>
              <p className="text-gray-300 text-sm leading-relaxed">在 HP 耗尽之前 <span className="text-white font-bold">击败全部 5 位 Boss</span> 即为胜利。每击败一位 Boss 都会获得永久奖励（回血 / 额外重骰 / 护甲……），帮助你应对后续更强的敌人。</p>
            </div>
          </div>
        </section>

        {/* Design Philosophy */}
        <section className="max-w-4xl mx-auto px-8 py-16 border-b border-gray-100">
          <Badge>Design Philosophy · 设计理念</Badge>
          <h2 className="text-3xl font-black text-gray-900 mb-2">为什么做这款游戏？</h2>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed max-w-2xl">骰子类游戏有天然吸引力，但纯运气游戏留不住玩家。这款游戏尝试在随机性与策略性之间找到平衡点。</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🎯', title: '决策密度', body: '每次掷骰后都面临「攻击 or 防御」的取舍。相同结果在不同 HP / 护甲 / Boss 状态下最优解截然不同。' },
              { icon: '🎲', title: '赌徒心理', body: '「再摇一次也许能摇出五条」的期待感是核心驱动力。重骰次数有限，将赌博冲动转化为有代价的策略。' },
              { icon: '⚖️', title: '风险管理', body: '当前手牌够用还是值得重骰？每次重骰都是对概率的押注，资源约束让"要不要再赌"成为真实决策。' },
              { icon: '📈', title: '成长弧线', body: '击败 Boss 带来永久能力变化：额外重骰、护甲保留、最大 HP 提升……每次胜利改变后续策略空间。' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-5">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="text-gray-900 font-bold text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Systems */}
        <section className="bg-gray-50">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <Badge>Core Systems · 核心机制</Badge>
            <h2 className="text-3xl font-black text-gray-900 mb-10">三层系统设计</h2>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {[
                { num: '01', title: '骰子牌型系统', points: ['投 5 颗骰子，自动识别最优牌型', '6 种牌型对应不同强度行动', '牌型难度与收益正相关'] },
                { num: '02', title: 'Boss 绑定系统', points: ['每位 Boss 绑定专属牌型才可攻击', '倒逼玩家在重骰与保留间取舍', '多 Boss 存活时需要优先级判断'] },
                { num: '03', title: '防御 / 治疗系统', points: ['同一牌型可攻击或防御，二选一', '护甲跨 Boss 攻击序列消耗', '永久护甲奖励改变长期策略'] },
              ].map(({ num, title, points }) => (
                <div key={num} className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-gray-200 text-4xl font-black mb-3" style={{ fontFamily: 'Cinzel, serif' }}>{num}</p>
                  <h3 className="text-gray-900 font-bold text-base mb-4">{title}</h3>
                  <ul className="space-y-2">
                    {points.map((p) => (
                      <li key={p} className="text-gray-500 text-xs flex gap-2">
                        <span className="text-gray-300 shrink-0">—</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Probability Design */}
        <section className="max-w-4xl mx-auto px-8 py-16 border-b border-gray-100">
          <Badge>Probability Design · 数值设计</Badge>
          <h2 className="text-3xl font-black text-gray-900 mb-2">概率与 Boss 的关联设计</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">5 颗骰子共 7776 种等概率结果。难以摇出的牌型绑定更强 Boss，形成概率与价值的正相关。</p>
          <div className="overflow-x-auto rounded-xl overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left py-3 px-4 font-semibold">牌型</th>
                  <th className="text-right py-3 px-4 font-semibold">出现概率</th>
                  <th className="text-left py-3 px-4 font-semibold">攻击目标</th>
                  <th className="text-left py-3 px-4 font-semibold">Boss ATK</th>
                  <th className="text-left py-3 px-4 font-semibold">防御收益</th>
                  <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">设计意图</th>
                </tr>
              </thead>
              <tbody>
                {PROB_TABLE.map(({ hand, prob, bossName, atk, defense, note }, i) => (
                  <tr key={hand} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 font-bold text-gray-900">{hand}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={parseFloat(prob) > 10 ? 'text-green-600' : parseFloat(prob) > 1 ? 'text-yellow-600' : 'text-red-500'}>{prob}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{bossName}</td>
                    <td className="py-3 px-4 font-bold text-red-500">{atk}</td>
                    <td className="py-3 px-4 text-blue-600">{defense}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-5 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="text-green-600 font-bold">■</span> 高概率（&gt;10%）</span>
            <span className="flex items-center gap-1"><span className="text-yellow-600 font-bold">■</span> 中概率（1–10%）</span>
            <span className="flex items-center gap-1"><span className="text-red-500 font-bold">■</span> 低概率（&lt;1%）</span>
          </div>
        </section>

        {/* Boss Design */}
        <section className="bg-gray-900">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <Badge dark>Boss Design · Boss 设计</Badge>
            <h2 className="text-3xl font-black text-white mb-2">每位 Boss 的设计职能</h2>
            <p className="text-gray-400 text-sm mb-10">每位 Boss 不只是数值差异，而是承载不同的玩家引导目标。</p>
            <BossCarousel />
          </div>
        </section>

        {/* Experience Arc */}
        <section className="max-w-4xl mx-auto px-8 py-16 border-b border-gray-100">
          <Badge>Experience Arc · 体验弧线</Badge>
          <h2 className="text-3xl font-black text-gray-900 mb-2">一局游戏的情绪节奏</h2>
          <p className="text-gray-500 text-sm mb-10">Boss 的登场顺序构建从轻松探索到高压博弈的完整弧线。</p>
          <div className="space-y-4">
            {[
              { phase: '早期', bosses: '石魔鬼 + 幻术师', mood: '探索期', bg: 'bg-gray-50', accent: 'bg-gray-900', desc: '高概率对子可稳定攻击石魔鬼，低 ATK 幻术师可安心试探重骰机制，建立基础认知。' },
              { phase: '中期', bosses: '国王 + 星灵', mood: '压力上升', bg: 'bg-orange-50', accent: 'bg-orange-500', desc: '国王需要稀有手牌，星灵几乎不可主动追求，ATK 最高。HP 开始告急，决策成本显著提升。' },
              { phase: '末期', bosses: '三头龙', mood: '终局博弈', bg: 'bg-red-50', accent: 'bg-red-600', desc: 'HP 已消耗、护甲耗尽，面对高 ATK（3）的三头龙。压力最大，形成最终爆发与释放感。' },
            ].map(({ phase, bosses, mood, bg, accent, desc }) => (
              <div key={phase} className={`${bg} rounded-xl p-5 flex gap-5 items-start`}>
                <div className={`${accent} text-white rounded-lg px-3 py-2 text-center shrink-0 min-w-[52px]`}>
                  <div className="text-xs font-black">{phase}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{mood}</div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">{bosses}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech */}
        <section className="bg-gray-50">
          <div className="max-w-4xl mx-auto px-8 py-14">
            <Badge>Technical · 技术实现</Badge>
            <h2 className="text-3xl font-black text-gray-900 mb-8">独立开发实现</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ['React 18', '组件化 UI + Hooks 状态'],
                ['Framer Motion', '骰子物理弹跳动画'],
                ['TailwindCSS v4', '响应式样式系统'],
                ['useReducer', '游戏状态机管理'],
              ].map(([name, desc]) => (
                <div key={name} className="bg-white rounded-xl p-5 shadow-sm">
                  <p className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{name}</p>
                  <p className="text-gray-400 text-xs">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 flex flex-col items-center justify-center text-center px-8 py-20">
          <p className="text-xs tracking-[0.4em] text-gray-500 uppercase mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Play Now · 开始体验</p>
          <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Ready to Roll?</h2>
          <p className="text-gray-400 text-sm mb-8">点击开始，体验完整游戏循环</p>
          <button onClick={() => act('SHOW_OPENING')} className="px-14 py-4 bg-white text-black text-base font-black rounded-xl hover:bg-gray-100 active:scale-95 transition-all cursor-pointer shadow-2xl" style={{ fontFamily: FONT, letterSpacing: '0.15em' }}>开始征战</button>
          <p className="text-gray-700 text-xs tracking-widest mt-10" style={{ fontFamily: 'Cinzel, serif' }}>✦ DICE · STRATEGY · GLORY ✦</p>
        </section>
      </div>
    </div>
  );
}
