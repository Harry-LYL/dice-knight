import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

function getVideoUrl(folder, fileName) {
  return `${import.meta.env.BASE_URL}assets/${folder}/${fileName}.mp4`;
}

export default function LeftPanel({ onVideoEnd }) {
  const { state } = useGame();
  const { leftPanelMode, leftPanelBossFileName: f } = state;

  const media =
    leftPanelMode === 'boss-idle' && f
      ? { src: getVideoUrl('idle', f), video: true }
      : leftPanelMode === 'boss-hurt' && f
        ? { src: getVideoUrl('hurt', f), video: true }
        : leftPanelMode === 'boss-attack' && f
          ? { src: getVideoUrl('attack', f), video: true }
          : { src: `${import.meta.env.BASE_URL}assets/idle/default.jpg`, video: false };

  const currentSrc = media.src;

  function handleEnded(src) {
    if (src === currentSrc) onVideoEnd?.();
  }

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={media.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {media.video ? (
            <video
              src={media.src}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => handleEnded(media.src)}
            />
          ) : (
            <img src={media.src} alt="" className="w-full h-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 border-r border-[#1e1e1e] pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
    </div>
  );
}
