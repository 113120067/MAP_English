import { useEffect, useState } from 'react';
import { ensureAuth, getUserProgress, unlockWord, type UserProgress } from './services/progress';
import { MapComponent } from './components/Map';
import { WordCard } from './components/WordCard';
import { LoadingScreen } from './components/LoadingScreen';
import { POC_WORDS, type WordData } from './data/words';
import './App.css';
import 'azure-maps-control/dist/atlas.min.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);

  const [words, setWords] = useState<WordData[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await ensureAuth();
        setUserUid(user.uid);

        // Parallel fetch
        const [userProgress, mnemonicWords] = await Promise.all([
          getUserProgress(user.uid),
          import('./services/mnemonics').then(m => m.fetchMnemonicWords())
        ]);

        setProgress(userProgress);
        setWords(mnemonicWords);
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleUnlock = async () => {
    if (!userUid || !selectedWord) return;

    // Optimistic update
    const newUnlocked = [...(progress?.unlockedWords || []), selectedWord.id];
    const newPoints = (progress?.points || 0) + 10;

    setProgress(prev => prev ? ({
      ...prev,
      unlockedWords: newUnlocked,
      points: newPoints
    }) : null);

    await unlockWord(userUid, selectedWord.id);
  };

  const [debugData, setDebugData] = useState<any>(null);
  const handleInspect = async () => {
    try {
      const { fetchSampleMnemonic } = await import('./services/mnemonics');
      const data = await fetchSampleMnemonic();
      setDebugData(data);
      console.log("Mnemonic Data:", data);
    } catch (e) {
      setDebugData({ error: String(e) });
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="app-container">
      {/* HUD */}
      <div className="hud">
        <div className="brand">🗺️ MapWords POC</div>
        <div className="stats">
          <span className="points">🏆 {progress?.points || 0} pts</span>
          <span className="count">Found: {progress?.unlockedWords.length}/{words.length}</span>
        </div>
        <button onClick={handleInspect} style={{ pointerEvents: 'auto', marginLeft: '10px' }}>🔍 Inspect Data</button>
      </div>

      {debugData && (
        <div style={{ position: 'absolute', top: 60, left: 10, background: 'rgba(0,0,0,0.8)', color: 'white', padding: 20, zIndex: 9999, maxWidth: '80%', overflow: 'auto', pointerEvents: 'auto' }}>
          <button onClick={() => setDebugData(null)} style={{ float: 'right' }}>X</button>
          <pre>{JSON.stringify(debugData, null, 2)}</pre>
        </div>
      )}

      <MapComponent
        words={words}
        unlockedWords={progress?.unlockedWords || []}
        onMarkerClick={setSelectedWord}
      />

      {selectedWord && (
        <WordCard
          wordData={selectedWord}
          isUnlocked={progress?.unlockedWords.includes(selectedWord.id) || false}
          onUnlock={handleUnlock}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
}

export default App;
