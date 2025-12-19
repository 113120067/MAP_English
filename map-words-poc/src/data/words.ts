export interface WordData {
    id: string;
    word: string;
    kk: string;
    definition: string;
    location: {
        lat: number;
        lng: number;
    };
}

export const POC_WORDS: WordData[] = [
    {
        id: "word_park",
        word: "park",
        kk: "[pɑrk]",
        definition: "公園",
        location: { lat: 25.0428, lng: 121.5064 } // 228 Peace Park
    },
    {
        id: "word_museum",
        word: "museum",
        kk: "[mjuˋziəm]",
        definition: "博物館",
        location: { lat: 25.0441, lng: 121.5134 } // National Taiwan Museum
    },
    {
        id: "word_hospital",
        word: "hospital",
        kk: "[ˋhɑspɪt!]",
        definition: "醫院",
        location: { lat: 25.0416, lng: 121.5165 } // NTU Hospital
    },
    {
        id: "word_school",
        word: "school",
        kk: "[skul]",
        definition: "學校",
        location: { lat: 25.0392, lng: 121.5175 } // Nearby School
    },
    {
        id: "word_coffee",
        word: "coffee",
        kk: "[ˋkɔfɪ]",
        definition: "咖啡",
        location: { lat: 25.0440, lng: 121.5110 } // Cafe near park
    }
];
