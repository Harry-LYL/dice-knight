export const BOSSES = [
  {
    id: 'stone',
    name: '石魔鬼',
    fileName: 'stone',
    hitsRequired: 2,
    atk: 2,
    hand: 'pair',
    handLabel: '对子',
    handDesc: '2个相同点数',
  },
  {
    id: 'wizard',
    name: '幻术师',
    fileName: 'wizard',
    imagePosition: 'center 35%',
    hitsRequired: 3,
    atk: 1,
    hand: 'straight',
    handLabel: '顺子',
    handDesc: '5个连续点数',
  },
  {
    id: 'king',
    name: '国王',
    fileName: 'king',
    hitsRequired: 3,
    atk: 2,
    hand: ['fourOfAKind', 'fullHouse'],
    handLabel: '四条 / 葫芦',
    handDesc: '4同 或 3+2组合',
  },
  {
    id: 'star',
    name: '星灵',
    fileName: 'star',
    hitsRequired: 1,
    atk: 4,
    hand: 'fiveOfAKind',
    handLabel: '五条',
    handDesc: '5个相同点数',
  },
  {
    id: 'dragon',
    name: '三头龙',
    fileName: 'dragon',
    hitsRequired: 2,
    atk: 3,
    hand: 'threeOfAKind',
    handLabel: '三条',
    handDesc: '3个相同点数',
  },
];

export const HAND_RANKINGS = {
  fiveOfAKind: { label: '五条', rank: 6 },
  fullHouse: { label: '葫芦', rank: 5 },
  fourOfAKind: { label: '四条', rank: 4 },
  threeOfAKind: { label: '三条', rank: 3 },
  straight: { label: '顺子', rank: 2 },
  pair: { label: '对子', rank: 1 },
};

export const DEFENSE_DATA = {
  pair: { type: 'armor', amount: 5, label: '+5 护甲' },
  straight: { type: 'armor', amount: 8, label: '+8 护甲' },
  threeOfAKind: { type: 'heal', amount: 3, label: '+3 HP' },
  fourOfAKind: { type: 'heal', amount: 4, label: '+4 HP' },
  fullHouse: { type: 'heal', amount: 5, label: '+5 HP' },
  fiveOfAKind: { type: 'heal', amount: 6, label: '+6 HP' },
};

export const BOSS_REWARDS = {
  stone: { type: 'heal', amount: 3, label: '获得 +3 HP' },
  wizard: { type: 'extraReroll', label: '解锁第三次重骰' },
  dragon: { type: 'maxHpIncrease', amount: 3, label: '最大HP +3' },
  king: { type: 'permanentArmor', label: '护甲永久保留' },
  star: { type: 'fullHeal', label: '满血复活' },
};

export const PROB_TABLE = [
  { hand: '对子', prob: '69.4%', raw: '5400/7776', bossName: '石魔鬼', atk: 2, defense: '+5 护甲', note: '概率最高，对应最弱 Boss，保障玩家每回合有牌可打' },
  { hand: '三条', prob: '15.4%', raw: '1200/7776', bossName: '三头龙', atk: 3, defense: '+3 HP', note: '中等概率绑定高伤害 Boss，攻防选择成本高' },
  { hand: '葫芦', prob: '3.9%', raw: '300/7776', bossName: '国王', atk: 2, defense: '+5 HP', note: '与四条共同克制国王，提供多路径攻击策略' },
  { hand: '顺子', prob: '3.1%', raw: '240/7776', bossName: '幻术师', atk: 1, defense: '+8 护甲', note: '概率低但 ATK 低，激励重骰，奖励解锁第三次重骰' },
  { hand: '四条', prob: '1.9%', raw: '150/7776', bossName: '国王', atk: 2, defense: '+4 HP', note: '比葫芦更难摇，与葫芦共用 Boss，增加攻击多样性' },
  { hand: '五条', prob: '0.08%', raw: '6/7776', bossName: '星灵', atk: 4, defense: '+6 HP', note: '极低概率对应最强 Boss，不可追求的惊喜感设计' },
];

export const BOSS_DESIGNS = [
  { fileName: 'stone', name: '石魔鬼', atk: 2, hits: 2, hand: '对子', role: '教学 Boss', color: '#888', design: '对子一次投骰概率约 69%，几乎每回合都能攻击。作为首位 Boss 降低上手门槛，让玩家先建立「掷骰 → 识别牌型 → 行动」的基础循环，击败奖励回 3 HP 强化正向反馈。' },
  { fileName: 'wizard', name: '幻术师', atk: 1, hits: 3, hand: '顺子', role: '机制引导 Boss', color: '#a0c4ff', design: '顺子概率仅约 3%，但 ATK 极低（仅 1 点）。低失败成本引导玩家主动使用重骰机制追逐顺子。击败奖励「解锁第三次重骰」直接奖励该行为，形成机制闭环。' },
  { fileName: 'king', name: '国王', atk: 2, hits: 3, hand: '四条 / 葫芦', role: '多路径 Boss', color: '#ffd700', design: '四条（1.9%）和葫芦（3.9%）均可击败，合计约 5.8%。设计目的是提供多条攻击路径，同时需要 3 次击败，拉长与该 Boss 的交战周期，考验资源分配持续性。' },
  { fileName: 'star', name: '星灵', atk: 4, hits: 1, hand: '五条', role: '压力 Boss', color: '#c0c0ff', design: '五条概率仅 0.08%，不可主动追求，完全依赖运气。ATK 最高（4 点），仅需 1 次击败。"可遇不可求"的设计带来强烈惊喜感，同时每回合对玩家造成最高持续压力。' },
  { fileName: 'dragon', name: '三头龙', atk: 3, hits: 2, hand: '三条', role: '收尾压力 Boss', color: '#ff8080', design: '三条概率约 15%，中等难度，但 ATK 高（3 点）。排在最后登场，彼时玩家 HP 已消耗，资源紧张之下面对高伤害 Boss，制造终局博弈感和压迫感。' },
];
