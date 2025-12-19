import { useState, useCallback, useEffect } from 'react';

interface SpeechRecognitionHook {
    isListening: boolean;
    transcript: string;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    isSupported: boolean;
    resetTranscript: () => void;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Browser compatibility check
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        currentTranscript += event.results[i][0].transcript;
                    } else {
                        currentTranscript += event.results[i][0].transcript;
                    }
                }
                setTranscript(currentTranscript);
            };

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error', event.error);
                setError(event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition) {
            try {
                setTranscript('');
                recognition.start();
            } catch (e) {
                console.warn("Speech recognition already started or failed to start", e);
            }
        } else {
            setError('Speech Recognition API not supported in this browser.');
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, [recognition]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        isSupported: !!recognition,
        resetTranscript
    };
};

// Add typescript definitions for Web Speech API if not present in environment
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        start(): void;
        stop(): void;
        abort(): void;
        onstart: (event: any) => void;
        onresult: (event: any) => void;
        onerror: (event: any) => void;
        onend: (event: any) => void;
    }

    interface SpeechRecognitionEvent {
        readonly resultIndex: number;
        readonly results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionResultList {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionResult {
        readonly isFinal: boolean;
        readonly length: number;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
    }

    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
        message: string;
    }
}
