import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeech } from './hooks/useSpeech';
import { MagicCard, type AnalysisData, type TeachingData } from './components/MagicCard';
import './App.css';

interface WordHistory {
  word: string;
  image: string;
  analysis?: AnalysisData;
  teaching?: TeachingData;
}

function App() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<WordHistory | null>(null);
  const [history, setHistory] = useState<WordHistory[]>(() => {
    const saved = localStorage.getItem('kids_history');
    return saved ? JSON.parse(saved) : [];
  });
  const { speak, voices, selectedVoiceURI, setSelectedVoiceURI, rate, setRate } = useSpeech();

  useEffect(() => {
    localStorage.setItem('kids_history', JSON.stringify(history));
  }, [history]);

  const generateImage = async (wordToGen = input) => {
    if (!wordToGen.trim()) return;
    setIsGenerating(true);

    try {
      // Call MAP Core Backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_URL}/api/v1/kids/generate`, {
        word: wordToGen
      });

      const data = response.data.data;
      const imageUrl = data.generated_image_url || data.imageUrl; // Handle both fields just in case

      // Construct Result with possible enhanced data (if cache hit)
      const newResult: WordHistory = {
        word: wordToGen,
        image: imageUrl,
        analysis: data.analysis,
        teaching: data.teaching
      };

      setResult(newResult);
      setHistory(prev => [newResult, ...prev.filter(h => h.word !== wordToGen)].slice(0, 10));

      // Auto-speak
      speak(wordToGen);

    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate image. Is the backend running?');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickChip = (word: string) => {
    setInput(word);
    generateImage(word);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🌟 Kids Vocab Creator 🌟</h1>
        <p>Type a word, get a picture!</p>
      </header>

      <main className="main-content">
        <div className="card input-card">
          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g., Apple, Red Car..."
              onKeyDown={e => e.key === 'Enter' && generateImage()}
            />
            <button
              onClick={() => generateImage()}
              disabled={isGenerating}
              className="btn-generate"
            >
              {isGenerating ? '🎨 Painting...' : '🎨 Go!'}
            </button>
          </div>

          <div className="quick-chips">
            {['Apple', 'Cat', 'Dog', 'Tree', 'Happy', 'Rainbow'].map(w => (
              <button key={w} onClick={() => handleQuickChip(w)} className="chip">
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Existing Simple Card (Optional: Can hide this if MagicCard covers it, but keeping it for "history" list context or quick view) */}
        {/* Actually, let's use MagicCard as the MAIN result view instead of the simple card when a result is active */}

        {result && (
          <MagicCard
            word={result.word}
            imageUrl={result.image}
            analysis={result.analysis}
            teaching={result.teaching}
            onClose={() => setResult(null)}
            onSpeak={speak}
          />
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h3>📚 Recent Words</h3>
            <div className="history-grid">
              {history.map(item => (
                <div key={item.word} className="history-item" onClick={() => {
                  setResult(item);
                  speak(item.word);
                }}>
                  <span>{item.word}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="settings-footer">
        <details>
          <summary>⚙️ Settings (Voice & Speed)</summary>
          <div className="settings-panel">
            <label>
              Speed:
              <input
                type="range"
                min="0.5" max="1.5" step="0.1"
                value={rate} onChange={e => setRate(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Voice:
              <select value={selectedVoiceURI} onChange={e => setSelectedVoiceURI(e.target.value)}>
                <option value="">Auto</option>
                {voices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                ))}
              </select>
            </label>
          </div>
        </details>
      </footer>
    </div>
  );
}

export default App;
