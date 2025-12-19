import { db } from "../firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { type WordData } from "../data/words";

// Center point for random location generation (Taipei 228 Park)
const CENTER_LAT = 25.0441;
const CENTER_LNG = 121.5134;
const RADIUS_DEG = 0.005; // Approx 500m radius

const getRandomLocation = () => {
    return {
        lat: CENTER_LAT + (Math.random() - 0.5) * RADIUS_DEG * 2,
        lng: CENTER_LNG + (Math.random() - 0.5) * RADIUS_DEG * 2
    };
};

export const fetchMnemonicWords = async (): Promise<WordData[]> => {
    try {
        // Fetch up to 20 words for the POC
        const q = query(collection(db, "mnemonic_generations"), limit(20));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                word: data.word || "Unknown",
                // Use theme or generic definition or teaching connection
                def: data.analysis?.theme || data.teaching?.connection || "No definition available",
                // Mnemonic data doesn't have KK, use placeholder or rely on browser TTS
                pronunciation: "---",
                location: getRandomLocation(),
                imageUrl: data.generated_image_url || data.github_url,
                teaching: data.teaching,
                parts: data.analysis?.parts
            };
        });
    } catch (error) {
        console.error("Error fetching mnemonic words:", error);
        return [];
    }
};

// Keep for debug button if needed, or component can be removed later
export const fetchSampleMnemonic = async () => {
    const q = query(collection(db, "mnemonic_generations"), limit(1));
    const s = await getDocs(q);
    return s.empty ? null : s.docs[0].data();
};
