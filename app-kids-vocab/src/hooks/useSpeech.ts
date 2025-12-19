import { useState, useEffect, useRef } from 'react';

export const useSpeech = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
    const [rate, setRate] = useState<number>(0.8);

    useEffect(() => {
        const loadVoices = () => {
            const vs = window.speechSynthesis.getVoices();
            console.log('Voices loaded:', vs.length);
            setVoices(vs.filter(v => v.lang.startsWith('en')));
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;

        if (selectedVoiceURI) {
            const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (voice) utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
    };

    return {
        voices,
        selectedVoiceURI,
        setSelectedVoiceURI,
        rate,
        setRate,
        speak
    };
};
