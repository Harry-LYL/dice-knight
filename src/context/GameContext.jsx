import { createContext, useContext, useReducer, useCallback } from 'react';
import { BOSSES, BOSS_REWARDS, DEFENSE_DATA } from '../data/bosses';
import { rollAll, reroll, detectHands } from '../utils/dice';

const GameContext = createContext(null);

let floatIdCounter = 0;
let floatSlotCounter = 0;

function createFloat(text, color) {
  const n = floatSlotCounter++ % 8;
  return {
    id: ++floatIdCounter,
    text,
    color,
    left: 52 + (n % 4) * 5 + (Math.random() - 0.5) * 3,
    bottom: 32 + Math.floor(n / 4) * 14 + (Math.random() - 0.5) * 4,
  };
}

export const INITIAL_STATE = {
  screen: 'home',
  showOpening: false,
  hp: 55,
  maxHp: 55,
  armor: 0,
  permanentArmor: false,
  maxRerolls: 2,
  bosses: BOSSES.map((b) => ({ ...b, hitsLeft: b.hitsRequired, alive: true })),
  phase: 'idle',
  dice: [1, 1, 1, 1, 1],
  lockedDice: [false, false, false, false, false],
  rerollsUsed: 0,
  detectedHands: [],
  hasRolled: false,
  floatingNumbers: [],
  pageShaking: false,
  attackingBossId: null,
  killedBossReward: null,
  leftPanelMode: 'default',
  leftPanelBossFileName: null,
};

function applyReward(state, killedBoss, reward) {
  if (!killedBoss || !reward) return state;
  const floats = [...state.floatingNumbers, createFloat(reward.label, '#ffd700')];
  switch (reward.type) {
    case 'heal':
      return { ...state, hp: Math.min(state.maxHp, state.hp + reward.amount), floatingNumbers: floats };
    case 'extraReroll':
      return { ...state, maxRerolls: state.maxRerolls + 1, floatingNumbers: floats };
    case 'maxHpIncrease':
      return { ...state, maxHp: state.maxHp + reward.amount, hp: state.hp + reward.amount, floatingNumbers: floats };
    case 'permanentArmor':
      return { ...state, permanentArmor: true, floatingNumbers: floats };
    case 'fullHeal':
      return { ...state, hp: state.maxHp, floatingNumbers: floats };
    default:
      return state;
  }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...INITIAL_STATE, screen: 'game', showOpening: false };
    case 'SHOW_OPENING':
      return { ...state, showOpening: true };
    case 'OPEN_ANIM_DONE':
      return { ...state, showOpening: false, screen: 'game' };
    case 'START_ROLL_ANIM':
      return { ...state, phase: 'rolling-animation' };
    case 'FINISH_ROLL': {
      if (state.phase === 'selecting') return state;
      const newDice = state.hasRolled ? reroll(state.dice, state.lockedDice) : rollAll(5);
      const hands = detectHands(newDice);
      return {
        ...state,
        phase: 'selecting',
        dice: newDice,
        detectedHands: hands,
        hasRolled: true,
        rerollsUsed: state.hasRolled ? state.rerollsUsed + 1 : 0,
        lockedDice: state.hasRolled ? state.lockedDice : [false, false, false, false, false],
      };
    }
    case 'TOGGLE_LOCK': {
      if (!state.hasRolled) return state;
      const locks = [...state.lockedDice];
      locks[action.index] = !locks[action.index];
      return { ...state, lockedDice: locks };
    }
    case 'SET_LOCKS':
      return { ...state, lockedDice: action.lockedDice };
    case 'SET_HOVER_BOSS':
      return {
        ...state,
        leftPanelMode: action.bossFileName ? 'boss-idle' : 'default',
        leftPanelBossFileName: action.bossFileName || null,
      };
    case 'SET_LEFT_PANEL':
      return {
        ...state,
        leftPanelMode: action.mode || 'default',
        leftPanelBossFileName: action.fileName || null,
      };
    case 'ATTACK_BOSS': {
      const bossId = action.bossId;
      const bosses = state.bosses.map((b) =>
        b.id === bossId ? { ...b, hitsLeft: b.hitsLeft - 1, alive: b.hitsLeft - 1 > 0 } : b
      );
      const killed = bosses.find((b) => b.id === bossId && !b.alive);
      const reward = killed ? BOSS_REWARDS[bossId] : null;
      let next = {
        ...state,
        bosses,
        phase: 'boss-attacking',
        attackingBossId: bossId,
        killedBossReward: reward,
        leftPanelMode: 'boss-hurt',
        leftPanelBossFileName: state.bosses.find((b) => b.id === bossId)?.fileName,
        floatingNumbers: [...state.floatingNumbers, createFloat('命中', '#ffffff')],
      };
      next = applyReward(next, killed, reward);
      return next;
    }
    case 'DEFEND': {
      if (!action.hand) return { ...state, phase: 'boss-attacking', attackingBossId: null };
      const def = DEFENSE_DATA[action.hand];
      if (!def) return { ...state, phase: 'boss-attacking', attackingBossId: null };
      let hp = state.hp;
      let armor = state.armor;
      const floats = [...state.floatingNumbers];
      if (def.type === 'armor') {
        armor = Math.min(5, state.armor + def.amount);
        floats.push(createFloat(`+${def.amount} 🛡`, '#a0c4ff'));
      } else {
        hp = Math.min(state.maxHp, state.hp + def.amount);
        floats.push(createFloat(`+${def.amount} HP`, '#90ee90'));
      }
      return { ...state, hp, armor, floatingNumbers: floats, phase: 'boss-attacking', attackingBossId: null };
    }
    case 'APPLY_BOSS_DAMAGE': {
      if (state.screen !== 'game') return state;
      const boss = state.bosses.find((b) => b.id === action.bossId);
      if (!boss || !boss.alive) return state;
      const blocked = Math.min(state.armor, boss.atk);
      const dmg = boss.atk - blocked;
      const newArmor = Math.max(0, state.armor - blocked);
      const newHp = state.hp - dmg;
      const floats = [...state.floatingNumbers];
      if (dmg > 0) floats.push(createFloat(`-${dmg}`, dmg >= 5 ? '#ff3333' : '#ff8080'));
      if (blocked > 0) floats.push(createFloat(`🛡 -${blocked}`, '#aaaaaa'));
      if (newHp <= 0) return { ...state, hp: 0, armor: newArmor, screen: 'defeat', floatingNumbers: floats };
      return { ...state, hp: newHp, armor: newArmor, floatingNumbers: floats, pageShaking: dmg > 0 };
    }
    case 'BOSS_ATTACK_DONE':
      if (state.screen !== 'game') return state;
      if (state.bosses.every((b) => !b.alive)) return { ...state, screen: 'victory' };
      return {
        ...state,
        phase: 'idle',
        hasRolled: false,
        rerollsUsed: 0,
        lockedDice: [false, false, false, false, false],
        detectedHands: [],
        attackingBossId: null,
        killedBossReward: null,
        leftPanelMode: 'default',
        leftPanelBossFileName: null,
        pageShaking: false,
        armor: state.permanentArmor ? state.armor : 0,
      };
    case 'CLEAR_PAGE_SHAKE':
      return { ...state, pageShaking: false };
    case 'ADD_FLOAT':
      return { ...state, floatingNumbers: [...state.floatingNumbers, createFloat(action.text, action.color)] };
    case 'REMOVE_FLOAT':
      return { ...state, floatingNumbers: state.floatingNumbers.filter((f) => f.id !== action.id) };
    case 'RESET':
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const act = useCallback((type, payload = {}) => dispatch({ type, ...payload }), []);
  return <GameContext.Provider value={{ state, act }}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
