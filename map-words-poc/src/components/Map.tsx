import React, { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import { type WordData } from '../data/words';
import './Map.css';

interface MapProps {
    words: WordData[];
    unlockedWords: string[];
    onMarkerClick: (word: WordData) => void;
}

export const MapComponent: React.FC<MapProps> = ({ words, unlockedWords, onMarkerClick }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInitialized = useRef(false);
    const [mapInstance, setMapInstance] = useState<atlas.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInitialized.current) return;
        mapInitialized.current = true;

        const map = new atlas.Map(mapRef.current.id, {
            center: [121.5134, 25.0441], // Taipei 228 Park
            zoom: 14,
            style: 'satellite', // Switching to Satellite to bypass vector tile rendering bugs
            view: 'Unified',
            renderWorldCopies: false,
            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY
            }
        });

        map.events.add('ready', () => {
            setMapInstance(map);

            // Add controls
            map.controls.add([new atlas.control.ZoomControl(), new atlas.control.PitchControl(), new atlas.control.CompassControl()], {
                position: atlas.ControlPosition.TopRight
            });
        });

        // In strict mode, we avoid disposing immediately to prevent re-init races.
        // For a full app we'd handle this more gracefully, but for POC this ensures stability.
    }, []);

    // Update markers when Map is ready or unlock status/words change
    useEffect(() => {
        if (!mapInstance || words.length === 0) return;

        // Use HtmlMarkers for simplicity in handling click events and styles dynamically
        const markers: atlas.HtmlMarker[] = [];

        words.forEach(word => {
            const isUnlocked = unlockedWords.includes(word.id);
            const color = isUnlocked ? '#f1c40f' : '#e74c3c'; // Gold vs Red

            const marker = new atlas.HtmlMarker({
                color,
                position: [word.location.lng, word.location.lat],
                text: isUnlocked ? '★' : '?',
                popup: new atlas.Popup({
                    content: `<div style="padding:10px"><b>${word.word}</b></div>`,
                    pixelOffset: [0, -30]
                })
            });

            mapInstance.markers.add(marker);

            // Add click event
            mapInstance.events.add('click', marker, () => {
                onMarkerClick(word);
            });

            markers.push(marker);
        });

        return () => {
            markers.forEach(m => mapInstance.markers.remove(m));
        };

    }, [mapInstance, words, unlockedWords, onMarkerClick]);

    return <div id="my-map" ref={mapRef} className="map-container" />;
};
