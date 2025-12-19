import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import './MagicCard.css';

export interface WordPart {
    label: string;
    content: string;
    definition: string;
}

export interface TeachingData {
    structure?: string;
    visual?: string;
    connection?: string;
}

export interface AnalysisData {
    type: string;
    parts: WordPart[];
    theme: string;
}

export interface MagicCardProps {
    word: string;
    imageUrl: string;
    analysis?: AnalysisData;
    teaching?: TeachingData;
    onClose: () => void;
    onSpeak: (text: string) => void;
}

export const MagicCard: React.FC<MagicCardProps> = ({
    word,
    imageUrl,
    analysis,
    teaching,
    onClose,
    onSpeak
}) => {
    const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition();
    const [feedback, setFeedback] = useState<'idle' | 'listening' | 'correct' | 'wrong'>('idle');
    const [reporting, setReporting] = useState(false);

    // Check pronunciation match
    useEffect(() => {
        if (!transcript) return;

        // Normalize logic
        const target = word.trim().toLowerCase();
        const spoken = transcript.trim().toLowerCase();

        // Simple containment check (fuzzy match)
        if (spoken.includes(target) || target.includes(spoken)) {
            // Allow partial match if word is long or recognition is fuzzy
            // Ensure at least some length to avoid false positives on short sounds
            if (spoken.length >= 2 || target.length <= 2) {
                setFeedback('correct');
                stopListening();
            }
        }
    }, [transcript, word, isListening, stopListening]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
            setFeedback('idle');
        } else {
            resetTranscript();
            setFeedback('listening');
            startListening();
        }
    };

    const handleReport = async (reason: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            await axios.post(`${API_URL}/api/v1/kids/report`, {
                word,
                reason,
                imageUrl
            });
            alert('Thank you! This image has been reported.');
            setReporting(false);
        } catch (e) {
            console.error(e);
            alert('Failed to send report.');
        }
    };

    return (
        <div className="word-card-overlay" onClick={onClose}>
            <div className="word-card" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                {imageUrl && (
                    <img src={imageUrl} alt={word} className="mnemonic-image" />
                )}

                <div className="word-header">
                    <h2>{word}</h2>
                </div>

                {/* Word Structure / Etymology Breakdown */}
                {analysis?.parts && analysis.parts.length > 0 && (
                    <div className="word-structure">
                        {analysis.parts.map((part, idx) => (
                            <span key={idx} className="structure-part">
                                <span className="part-content">{part.content}</span>
                                <span className="part-label">{part.label}</span>
                                {/* Optional: Show definition tooltip or small text */}
                            </span>
                        ))}
                    </div>
                )}

                {/* Mnemonic Story */}
                {teaching && (
                    <div className="mnemonic-teaching">
                        {teaching.structure && (
                            <div className="teaching-section">
                                <strong>🧩 結構:</strong>
                                <p>{teaching.structure}</p>
                            </div>
                        )}
                        {teaching.visual && (
                            <div className="teaching-section">
                                <strong>👁️ 畫面聯想:</strong>
                                <p>{teaching.visual}</p>
                            </div>
                        )}
                        {teaching.connection && (
                            <div className="teaching-section">
                                <strong>🧠 記憶連結:</strong>
                                <p>{teaching.connection}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Fallback if no enhanced data yet */}
                {!teaching && !analysis && (
                    <p className="definition" style={{ color: '#95a5a6', fontStyle: 'italic' }}>
                        (魔法記憶卡正在後端生成中... 請稍後再試)
                    </p>
                )}

                {/* Actions Row */}
                <div className="actions">
                    <button onClick={() => onSpeak(word)} className="icon-btn" title="Listen">
                        🔊 Listen
                    </button>

                    {isSupported && (
                        <button
                            onClick={handleMicClick}
                            className={`icon-btn ${isListening ? 'listening-pulse' : ''} ${feedback === 'correct' ? 'correct-glow' : ''}`}
                            title="Practice Speaking"
                            style={feedback === 'correct' ? { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' } : {}}
                        >
                            {isListening ? '🎙️ Listening...' : feedback === 'correct' ? '🎉 Great Job!' : '🎙️ Try Saying It'}
                        </button>
                    )}

                    <button onClick={() => setReporting(!reporting)} className="icon-btn" title="Report Issue" style={{ color: '#c0392b' }}>
                        🚩
                    </button>
                </div>

                {/* Real-time Transcript Feedback */}
                {isListening && <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>Heard: {transcript}</p>}

                {/* Report Modal / Overlay */}
                {reporting && (
                    <div className="report-overlay">
                        <p>What's wrong?</p>
                        <div className="report-options">
                            {['Scary 😱', 'Wrong Word ❌', 'Glitch 👾', 'Other'].map(r => (
                                <button key={r} onClick={() => handleReport(r)} className="report-chip">
                                    {r}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setReporting(false)} className="cancel-report">Cancel</button>
                    </div>
                )}

            </div>
        </div>
    );
};
