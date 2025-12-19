import React from 'react';
import { type WordData } from '../data/words';
import { Volume2, CheckCircle } from 'lucide-react';
import './WordCard.css';

interface WordCardProps {
    wordData: WordData;
    isUnlocked: boolean;
    onUnlock: () => void;
    onClose: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ wordData, isUnlocked, onUnlock, onClose }) => {
    const speak = () => {
        const utterance = new SpeechSynthesisUtterance(wordData.word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="word-card-overlay">
            <div className="word-card">
                <button className="close-btn" onClick={onClose}>×</button>

                {wordData.imageUrl && (
                    <img src={wordData.imageUrl} alt={wordData.word} className="mnemonic-image" />
                )}

                <div className="word-header">
                    <h2>{wordData.word}</h2>
                    <span className="kk">{wordData.pronunciation}</span>
                </div>

                <p className="definition">{wordData.def}</p>

                {/* Word Structure */}
                {wordData.parts && wordData.parts.length > 0 && (
                    <div className="word-structure">
                        {wordData.parts.map((part, idx) => (
                            <span key={idx} className="structure-part">
                                <span className="part-content">{part.content}</span>
                                <span className="part-label">{part.label}</span>
                            </span>
                        ))}
                    </div>
                )}

                {/* Mnemonic Story */}
                {wordData.teaching && (
                    <div className="mnemonic-teaching">
                        {wordData.teaching.connection && (
                            <div className="teaching-section">
                                <strong>🧠 Memory Link:</strong>
                                <p>{wordData.teaching.connection}</p>
                            </div>
                        )}
                        {wordData.teaching.visual && (
                            <div className="teaching-section">
                                <strong>👁️ Visual Scene:</strong>
                                <p>{wordData.teaching.visual}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="actions">
                    <button onClick={speak} className="icon-btn" title="Listen">
                        <Volume2 size={24} /> Listen
                    </button>

                    {!isUnlocked ? (
                        <button onClick={onUnlock} className="primary-btn">
                            I Found It! (+10 pts)
                        </button>
                    ) : (
                        <div className="unlocked-badge">
                            <CheckCircle size={20} /> Collected
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
