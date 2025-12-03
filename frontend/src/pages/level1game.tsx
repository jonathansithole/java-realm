// frontend/src/pages/ArcadePage.tsx

import React, { useState } from 'react';
import Level1Game from '../components/Level1Game/Level1Game.tsx'; // Explicitly use .tsx
import { useNavigate } from 'react-router-dom';

// Note: ArcadePage itself is a dedicated route, so it does NOT need 
// to accept props like onClose or onGameOver.

const level1game: React.FC = () => {
    const [lastScore, setLastScore] = useState<number | null>(null);
    const navigate = useNavigate();

    // --- 1. Define handleCloseGame ---
    const handleCloseGame = () => {
        // Navigate back to the WorldMap page
        navigate('/worldmap'); 
    };

    // --- 2. Define handleGameResult ---
    const handleGameResult = (score: number) => {
        setLastScore(score); 
        
        // API Call to your Monorepo's BACKEND (server.js)
        fetch('/api/scores', {
            method: 'POST',
            body: JSON.stringify({ score, userId: 'current_user_id' }),
            headers: { 'Content-Type': 'application/json' },
        });
    };

    // --- 3. The JSX Block (The highlighted section) ---
    return (
        <div className="w-full h-full">
            
            {/* Render the Embedded Game Component (Level1Game) */}
            <Level1Game 
                userId={'current_user_id'} 
                initialState={{ xp: 100 }} // Prop passed from this parent
                onGameOver={handleGameResult} // Callback for when game sends score
                onClose={handleCloseGame} // Callback for when game needs to exit the page
            />
            
            {/* You can keep the score display here if you want it over the game */}
            {lastScore !== null && (
                 <div className="absolute top-0 left-0 p-4 bg-black/50 text-white rounded m-4">
                     <p>Last Score: {lastScore}</p>
                 </div>
            )}
        </div>
    );
};

export default level1game;

// --- REMOVED THE CONFLICTING EMPTY FUNCTION ---
// export default function Arcadepage({ onClose, onGameOver, userId, initialState }: GameComponentProps) {}