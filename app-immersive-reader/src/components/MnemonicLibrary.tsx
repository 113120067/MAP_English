import React, { useEffect, useState } from 'react';
import { getLibrary } from '../services/api';
import { ReaderLauncher } from './ReaderLauncher';
import { BookOpen } from 'lucide-react';

interface MnemonicCard {
    id: string;
    word: string;
    teaching?: {
        connection?: string;
        visual?: string;
    };
    analysis?: {
        theme?: string;
    };
    imageUrl?: string;
}

export const MnemonicLibrary: React.FC = () => {
    const [cards, setCards] = useState<MnemonicCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<MnemonicCard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const data = await getLibrary();
                setCards(data);
            } catch (error) {
                console.error("Error fetching library:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    if (selectedCard) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => setSelectedCard(null)}
                    className="text-blue-500 hover:underline"
                >
                    &larr; Back to Library
                </button>
                <ReaderLauncher
                    autoLaunch={true}
                    initialTitle={selectedCard.word}
                    initialContent={`
                        <h2>${selectedCard.word}</h2>
                        <p><strong>Theme:</strong> ${selectedCard.analysis?.theme || 'General'}</p>
                        <p>${selectedCard.teaching?.connection || 'No story available.'}</p>
                        <br/>
                        <p><em>${selectedCard.teaching?.visual || ''}</em></p>
                    `}
                />
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen /> Mnemonic Library
            </h1>
            {loading ? <p>Loading library...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className="border p-4 rounded shadow hover:shadow-lg cursor-pointer transition"
                            onClick={() => setSelectedCard(card)}
                        >
                            <h3 className="text-xl font-bold text-indigo-600">{card.word}</h3>
                            <p className="text-sm text-gray-500">{card.analysis?.theme}</p>
                            <p className="border-t mt-2 pt-2 text-gray-700 line-clamp-3">
                                {card.teaching?.connection}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
