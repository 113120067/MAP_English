export interface AppDefinition {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji for POC, URL for production
    url: string;
    category: 'client' | 'generator' | 'admin';
    status: 'stable' | 'beta' | 'dev';
}

export const APPS: AppDefinition[] = [
    {
        id: 'com.kids.vocab',
        name: 'Kids Vocab Creator',
        description: 'Type a word and get a cute cartoon instantly! (Standalone App)',
        icon: '🎨',
        url: import.meta.env.VITE_APP_KIDS_VOCAB_URL || 'http://localhost:5173',
        category: 'client',
        status: 'stable'
    },
    {
        id: 'com.mapwords.game',
        name: 'MapWords Adventure',
        description: 'Explore the real world map to find and unlock English mnemonic cards.',
        icon: '🗺️',
        url: import.meta.env.VITE_APP_MAPWORDS_URL || 'http://localhost:5176',
        category: 'client',
        status: 'beta'
    },
    {
        id: 'com.immersive.reader',
        name: 'Immersive Reader',
        description: 'Practice reading with AI-generated mnemonics and Microsoft Immersive Reader.',
        icon: '📖',
        url: import.meta.env.VITE_APP_IMMERSIVE_READER_URL || 'http://localhost:5175',
        category: 'client',
        status: 'stable'
    },
    {
        id: 'com.example.quiz',
        name: 'Vocab Quiz Battle',
        description: 'Coming soon: A multiplayer quiz game using shared mnemonic data.',
        icon: '⚔️',
        url: '#',
        category: 'client',
        status: 'dev'
    }
];
