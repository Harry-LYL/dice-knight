import { useGame } from './context/GameContext';
import HomeScreen from './components/HomeScreen';
import OpeningScreen from './components/OpeningScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';

export default function App() {
  const { state } = useGame();

  if (state.showOpening) return <OpeningScreen />;
  if (state.screen === 'home') return <HomeScreen />;
  if (state.screen === 'game') return <GameScreen />;
  if (state.screen === 'victory') return <EndScreen type="victory" />;
  if (state.screen === 'defeat') return <EndScreen type="defeat" />;
  return <HomeScreen />;
}
