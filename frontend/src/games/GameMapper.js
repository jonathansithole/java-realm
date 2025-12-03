// frontend/src/games/GameMapper.js

import Level1BossGame from '../components/Level1Game/Level1Game.tsx';

import Level2BossGame from '../components/Level2Game/Level2Game.tsx'; // <-- NEW IMPORT
import Level3BossGame from '../components/Level3Game/Level3Game.tsx';
import Level4BossGame from '../components/Level4Game/Level4Game.tsx';
import Level5BossGame from '../components/Level5Game/Level5Game.tsx';
import Level6BossGame from '../components/Level6Game/Level6Game.tsx';
import Level7BossGame from '../components/Level7Game/Level7Game.tsx';
import Level8BossGame from '../components/Level8Game/Level8Game.tsx';

// Map World IDs to their corresponding Game Component
const BOSS_GAMES_MAP = {
    '1': Level1BossGame, // World 1 uses the Level1Game component
 '2': Level2BossGame, // Uncomment when you create a Boss Game for World 2
 '3': Level3BossGame,
 '4': Level4BossGame,
 '5': Level5BossGame,
 '6': Level6BossGame,
 '7': Level7BossGame,
 '8': Level8BossGame,
};

// Default to World 1's game if no match is found
const DefaultGame = Level1BossGame;

export const getBossGameComponent = (worldId) => {
    return BOSS_GAMES_MAP[worldId] || DefaultGame;
};