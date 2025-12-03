
import { GameState, CodeLine } from './types.ts';
import { CODE_CHALLENGE_LINES, DIALOGUE } from './constants.ts';
import { GoogleGenAI, Modality } from "@google/genai";
import React, { useState, useEffect, useRef , useCallback, useMemo} from 'react';

const initialCodeState = (): CodeLine[] =>
  JSON.parse(JSON.stringify(CODE_CHALLENGE_LINES));

// --- AUDIO DECODING HELPERS ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// --- HELPER & UI COMPONENTS (Defined outside App to prevent re-renders) ---

const FloatingRunes: React.FC = () => {
  const runes = useMemo(() => Array.from({ length: 50 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 1 + 0.5}rem`,
      animationDuration: `${Math.random() * 20 + 10}s`,
      animationDelay: `${Math.random() * -30}s`,
    };
    const chars = ['ᛗ', 'ᛟ', 'ᚾ', 'ᚷ', 'ᛟ', 'ᛞ', 'ᛒ'];
    const char = chars[Math.floor(Math.random() * chars.length)];
    return { id: i, style, char };
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.5; }
        }
      `}</style>
      {runes.map(rune => (
        <span
          key={rune.id}
          className="absolute text-cyan-400/30 animate-[float_linear_infinite]"
          style={rune.style}
        >
          {rune.char}
        </span>
      ))}
    </div>
  );
};

const AnimatedMan: React.FC<{ waterLevel: number }> = ({ waterLevel }) => {
    const animationState = useMemo(() => {
        if (waterLevel > 75) return 'struggling';
        if (waterLevel > 25) return 'panicking';
        return 'idle';
    }, [waterLevel]);

    const isWet = waterLevel > 10;
    const isSubmerged = waterLevel > 40;

    return (
        <>
            <style>{`
                /* Base Colors */
                :root {
                    --skin-tone: #A67C52;
                    --hair-color: #2a201c;
                    --shirt-color: #556270;
                    --pants-color: #333a42;
                    --shirt-wet-color: #3E4854;
                    --pants-wet-color: #24282e;
                    --hair-wet-color: #1a1411;
                }

                .man-svg { 
                    width: 12rem; 
                    height: 24rem;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .man-figure .body-part { transition: fill 0.5s ease-in-out; }

                /* Wet Look */
                .man-figure.wet .hair { fill: var(--hair-wet-color); }
                .man-figure.wet .shirt { fill: var(--shirt-wet-color); }
                .man-figure.submerged .pants { fill: var(--pants-wet-color); }

                /* Idle Animations */
                @keyframes idle-breathe {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-1.5px); }
                }
                @keyframes idle-blink {
                    0%, 95%, 100% { transform: scaleY(1); }
                    97.5% { transform: scaleY(0.1); }
                }
                .man-figure.idle .torso-group { animation: idle-breathe 4s ease-in-out infinite; }
                .man-figure.idle .eye { animation: idle-blink 5s infinite; }

                /* Panicking Animations */
                @keyframes panic-breathe {
                    0%, 100% { transform: translateY(0) scale(1.0); }
                    50% { transform: translateY(-3px) scale(1.01); }
                }
                @keyframes look-around {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
                @keyframes press-hands {
                   0%, 100% { transform: translateX(0) rotate(0); }
                   50% { transform: translateX(-3px) rotate(-2deg); }
                }
                .man-figure.panicking .torso-group { animation: panic-breathe 1.5s ease-in-out infinite; }
                .man-figure.panicking .head-group { animation: look-around 3s ease-in-out infinite; }
                .man-figure.panicking .arm { animation: press-hands 1s ease-in-out infinite alternate; }

                /* Struggling Animations */
                @keyframes struggle-body {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    25% { transform: translateY(-15px) rotate(-3deg); }
                    75% { transform: translateY(-10px) rotate(3deg); }
                }
                 @keyframes flail-arm {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-35deg); }
                }
                .man-figure.struggling { animation: struggle-body 1.2s ease-in-out infinite; }
                .man-figure.struggling .arm.left { animation: flail-arm 0.8s ease-in-out infinite alternate; }
                .man-figure.struggling .arm.right { animation: flail-arm 0.8s ease-in-out infinite alternate-reverse; }
                .man-figure.struggling .mouth { transform: scaleY(0.8); }
            `}</style>
             <svg viewBox="0 0 200 400" className="man-svg" aria-label="A young man trapped in a chamber.">
                <g className={`man-figure ${animationState} ${isWet ? 'wet' : ''} ${isSubmerged ? 'submerged' : ''}`} transform="translate(15, 20)">
                    {/* Legs */}
                    <g className="legs-group">
                        <path className="body-part pants" fill="var(--pants-color)" d="M80 270 C 60 350, 60 380, 60 380 L 75 380 C 75 380, 80 340, 85 270 Z" />
                        <path className="body-part pants" fill="var(--pants-color)" d="M105 270 C 125 350, 125 380, 125 380 L 110 380 C 110 380, 105 340, 100 270 Z" />
                        <path className="body-part feet" fill="var(--skin-tone)" d="M60 380 C 50 385, 45 380, 60 380 Z" />
                        <path className="body-part feet" fill="var(--skin-tone)" d="M125 380 C 135 385, 140 380, 125 380 Z" />
                    </g>
                    {/* Arms */}
                    <g className="arms-group" transform="translate(0, 150)">
                         <g className="arm left" transform-origin="80px 10px">
                            <path className="body-part" fill="var(--skin-tone)" d="M75 10 C 60 50, 65 90, 65 90 L 75 92 C 80 60, 85 20, 75 10 Z" />
                            <path className="body-part hand" fill="var(--skin-tone)" d="M65 90 C 58 92, 58 102, 68 100 L 70 98 C 65 96, 65 90, 65 90 Z" />
                        </g>
                        <g className="arm right" transform-origin="105px 10px">
                            <path className="body-part" fill="var(--skin-tone)" d="M110 10 C 125 50, 120 90, 120 90 L 110 92 C 105 60, 100 20, 110 10 Z" />
                             <path className="body-part hand" fill="var(--skin-tone)" d="M120 90 C 127 92, 127 102, 117 100 L 115 98 C 120 96, 120 90, 120 90 Z" />
                        </g>
                    </g>
                    {/* Torso */}
                    <g className="torso-group" transform-origin="92.5px 220px">
                        <path className="body-part shirt" fill="var(--shirt-color)" d="M80,140 C 60,150 50,220 70,270 L 115,270 C 135,220 125,150 105,140 L 92.5,150 Z" />
                        <path className="body-part neck" fill="var(--skin-tone)" d="M88,135 C 88,125 97,125 97,135 L 92.5 150 Z" />
                    </g>
                    {/* Head */}
                    <g className="head-group" transform-origin="92.5px 120px">
                        <path className="body-part face" fill="var(--skin-tone)" d="M70,120 C 60,70 125,70 115,120 Q 92.5,140 70,120 Z" />
                        <path className="body-part hair" fill="var(--hair-color)" d="M65,100 C 40,80 50,40 92.5,50 C 135,40 145,80 120,100 Z" />
                        <g className="eyes-group" transform="translate(0, 95)">
                            <path className="eyebrow" fill="none" stroke="var(--hair-color)" strokeWidth="2" d="M78 0 Q 85 -5, 92 0" />
                            <path className="eyebrow" fill="none" stroke="var(--hair-color)" strokeWidth="2" d="M98 0 Q 105 -5, 112 0" />
                            <circle className="body-part eye" cx="85" cy="5" r="3" fill="var(--hair-color)" transform-origin="85px 5px"/>
                            <circle className="body-part eye" cx="105" cy="5" r="3" fill="var(--hair-color)" transform-origin="105px 5px"/>
                        </g>
                        <path className="body-part mouth" d="M88 118 Q 92.5 122, 97 118" stroke="var(--hair-color)" strokeWidth="1.5" fill="none" transform-origin="92.5px 120px"/>
                    </g>
                </g>
            </svg>
        </>
    );
};
// Define this component near the top of your Level1Game.tsx file

interface TutorialModalProps {
    onStart: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ onStart }) => {
    // State to track the current step
    const [stepIndex, setStepIndex] = useState(0); 

    const tutorialSteps = useMemo(() => [
        { 
            title: "Welcome to the Rising Chamber", 
            text: "The chamber is filling with water. Your mission is to fix the code syntax errors to stop the flood and complete the challenge.",
            icon: "🌊"
        },
        { 
            title: "Live Linter Feedback", 
            text: (
                <>
                    <p>The editor provides **instant, line-by-line feedback** as you type. Pay close attention to the color changes:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 text-left">
                        <li className="text-green-400">**GREEN** code is syntactically correct.</li>
                        <li className="text-red-400">**RED** code is syntactically wrong (but editable).</li>
                        <li className="text-yellow-300">**YELLOW** lines are the broken parts you must correct.</li>
                    </ul>
                </>
            ),
            icon: "🚦"
        },
        { 
            title: "Scoring & The Timer", 
            text: "Your final score is based on a few factors: Base Score - Time Penalty - Water Penalty - Hint Penalty. Efficiency and speed are key!",
            icon: "⏱️"
        },
        { 
            title: "The Hint Penalty", 
            text: "You can use the 'GET HINT' button once to reveal all required fixes. This incurs a massive score penalty, so use it only as a last resort.",
            icon: "💡"
        },
        { 
            title: "Ready to Begin", 
            text: "Good luck! The clock starts as soon as you press the button below.",
            icon: "🚀"
        },
    ], []); // Tutorial steps are static

    const currentStep = tutorialSteps[stepIndex];
    const isFirstStep = stepIndex === 0;
    const isReadyToStart = stepIndex === tutorialSteps.length - 1;

    const handleNext = () => {
        if (isReadyToStart) {
            onStart(); // Start the game
        } else {
            setStepIndex(prev => prev + 1); // Move to the next step
        }
    };
    
    const handleBack = () => {
        if (!isFirstStep) {
            setStepIndex(prev => prev - 1);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg shadow-2xl p-8 text-center w-11/12 max-w-lg">
                
                {/* --- ICON/TITLE --- */}
                <div className="text-cyan-400 mb-4 text-4xl animate-pulse">
                    {currentStep.icon}
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-3">
                    {currentStep.title}
                </h1>

                {/* --- TUTORIAL CONTENT --- */}
                <div className="text-gray-300 mb-8 text-md text-center">
                    {currentStep.text}
                </div>

                {/* --- NAVIGATION BUTTONS --- */}
                <div className="flex justify-between items-center mt-6">
                    {/* BACK Button */}
                    <button 
                        onClick={handleBack}
                        disabled={isFirstStep}
                        className="py-2 px-4 text-white font-bold rounded-md transition-colors bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500"
                    >
                        PREV
                    </button>

                    {/* START/NEXT Button */}
                    <button 
                        onClick={handleNext}
                        className={`py-3 px-8 text-white font-bold rounded-md transition-all duration-300 
                            ${isReadyToStart ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.4)]'}
                        `}
                    >
                        {isReadyToStart ? 'START CHALLENGE' : 'NEXT STEP'}
                    </button>
                </div>
                
                {/* Step Indicator */}
                <p className="text-sm text-gray-500 mt-4">
                    Step {stepIndex + 1} of {tutorialSteps.length}
                </p>
            </div>
        </div>
    );
};

interface ChamberProps {
  gameState: GameState;
  waterLevel: number;
 
}

const Chamber: React.FC<ChamberProps> = ({ gameState, waterLevel }) => {
  const isShattered = gameState === GameState.Success;
  const isGameOver = gameState === GameState.Success || gameState === GameState.Fail;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <FloatingRunes />
      <div className={`relative w-48 h-96 md:w-64 md:h-[32rem] border-4 rounded-t-full transition-all duration-1000 ease-in-out ${isShattered ? 'border-transparent' : 'border-cyan-400/50 backdrop-blur-sm'}`}>
        <div className={`absolute inset-0 rounded-t-full transition-opacity duration-1000 ${isShattered ? 'opacity-0' : 'opacity-100'}`} style={{background: 'radial-gradient(ellipse at center, rgba(10,100,120,0.1) 0%, rgba(10,40,60,0.5) 100%)'}}>
          
          {/* Water */}
          <div 
            className="absolute bottom-0 w-full bg-blue-500/60 backdrop-blur-xs rounded-t-full transition-all duration-1000 ease-linear"
            style={{ height: `${waterLevel}%` }}
          >
            <div className="absolute top-0 w-full h-2 bg-blue-300/50 opacity-50"></div>
          </div>
        </div>

         {/* Shatter Effect */}
        {isShattered && (
            <div className="absolute inset-0">
                {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="absolute w-px h-full bg-yellow-300" style={{
                        left: `${Math.random()*100}%`,
                        top: `${Math.random()*100}%`,
                        transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() + 0.5})`,
                        opacity: 0,
                        animation: `flash 1s ${i*0.02}s ease-out forwards`
                    }}></div>
                ))}
                <style>{`
                  @keyframes flash {
                    0% { opacity: 0.8; transform: scale(0.1); }
                    100% { opacity: 0; transform: scale(2); }
                  }
                `}</style>
            </div>
        )}
      </div>

    
    </div>
  );
};

interface CodeEditorProps {
  lines: CodeLine[];
  onCodeChange: (id: number, value: string) => void;
  onRunCode: () => void;
  onRequestHint: () => void;
  isDisabled: boolean;
  isHintAvailable: boolean;
  currentHint: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ lines, onCodeChange, onRunCode, onRequestHint, isDisabled, isHintAvailable, currentHint }) => {
  const getLineClass = (line: CodeLine) => {
    if (!line.isBroken) return 'text-gray-400';
    switch(line.status) {
      case 'correct': return 'text-green-400';
      case 'incorrect': return 'text-red-500';
      case 'pending':
      default: return 'text-yellow-300';
    }
  };

  return (
    <div className="w-full h-full bg-gray-900/80 backdrop-blur-md border-l-2 border-cyan-500/30 p-4 flex flex-col">
      <h2 className="text-lg font-bold text-cyan-300 mb-2">OBJECTIVE:</h2>
      <p className="text-cyan-100 mb-4 text-sm">Fix the code to free the captive. The water will continue rising until the program runs successfully.</p>
       {/* --- NEW HINT DISPLAY AREA --- */}
    {currentHint && (
        <div className="bg-yellow-900/50 border-l-4 border-yellow-400 p-2 my-2 rounded-md shadow-inner text-xs">
            <p className="font-semibold text-yellow-200">HINT:</p>
            <p className="text-yellow-100 italic" style={{ whiteSpace: 'pre-wrap' }}>
                {currentHint}
            </p>
        </div>
      )}

 <div className="flex-grow max-h-[calc(100vh-220px)] bg-black/50 rounded-md p-2 font-mono text-xs overflow-auto"> 
        <pre>
          {lines.map((line) => (
            <div key={line.id} className="flex items-center">
              <span className="text-gray-600 w-6 text-right pr-2">{line.id}</span> {/* Reduced width */}
              {line.isBroken ? (
                <input
                  type="text"
                  value={line.userAttempt}
                  onChange={(e) => onCodeChange(line.id, e.target.value)}
                  className={`flex-grow bg-transparent outline-none border-b border-dashed ${line.status === 'incorrect' ? 'border-red-500/50' : 'border-gray-700'} focus:border-cyan-400 ${getLineClass(line)}`}
                  spellCheck="false"
                  disabled={isDisabled}
                  aria-label={`Code line ${line.id}, editable`}
                />
              ) : (
                <code className={getLineClass(line)}>{line.content}</code>
              )}
            </div>
          ))}
        </pre>
      </div>
      
       <div className="p-2 border-t border-gray-700 bg-gray-900/90 flex flex-col sm:flex-row gap-2">
        <button
          onClick={onRequestHint}
          disabled={isDisabled || !isHintAvailable}
          className="flex-grow py-2 px-4 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600 transition disabled:bg-gray-800 disabled:text-gray-500 shadow-md"
        >
          GET HINT
        </button>
        <button 
          onClick={onRunCode}
          disabled={isDisabled}
          className="flex-grow py-2 px-4 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 active:bg-cyan-700 transition shadow-lg"
        >
          RUN CODE
        </button>
      </div>
    </div>
  );
};


interface EndScreenProps {
    gameState: GameState;
    onRestart: () => void;
      onClose: () => void; // New prop for closing
 finalScore: number | null; // <-- NEW
    scoreMessage: string;  
    timeElapsed: number;
    }
interface GameComponentProps {
    onClose: () => void; // New prop for closing
    onGameOver: (finalScore: number) => void; // Existing prop for score/completion
    userId: string;
    initialState: { xp: number };
}
interface ChamberProps { gameState: GameState; waterLevel: number; }
interface CodeEditorProps { lines: CodeLine[]; onCodeChange: (id: number, value: string) => void; onRunCode: () => void; onRequestHint: () => void; isDisabled: boolean; isHintAvailable: boolean; }


const EndScreen: React.FC<EndScreenProps> = ({ gameState, onRestart, onClose, finalScore, scoreMessage, timeElapsed }) => { 
    if (gameState !== GameState.Success && gameState !== GameState.Fail) return null;

    const isSuccess = gameState === GameState.Success;
    const title = isSuccess ? "Prisoner Freed" : "Mission Failed";
    const subtitle = isSuccess ? "Challenge Successful." : "The chamber has been flooded.";
    const borderColor = isSuccess ? "border-green-500" : "border-red-500";
    const textColor = isSuccess ? "text-green-300" : "text-red-300";
    const buttonColor = isSuccess ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500";
const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

    return (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
            `}</style>
            <div className={`bg-gray-800 border-2 ${borderColor} rounded-lg shadow-2xl p-8 text-center w-11/12 max-w-md`}>
    
    {/* ... (Title/Subtitle) ... */}

    {/* --- DISPLAY TIME AND SCORE --- */}
    {isSuccess && finalScore !== null && (
        <div className="bg-gray-700 p-4 rounded-md mb-4">
            <p className="text-lg font-extrabold text-white">
                Time Taken: <span className="text-cyan-400">{formatTime(timeElapsed)}</span>
            </p>
            <p className="text-xl font-extrabold text-white mt-1">
                Final Score: <span className="text-green-400">{finalScore}</span>
            </p>
            {/* THIS IS THE CORRECT PLACE FOR THE DETAILED SCORE MESSAGE */}
            {scoreMessage && (
                 <p className="text-sm text-yellow-300 mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                    {scoreMessage}
                </p>
            )}
        </div>
    )}
    
         


                {isSuccess && <p className="text-gray-300 mb-6">New Coding Trial Unlocked.</p>}
                <button onClick={onRestart} className={`px-8 py-3 text-white font-bold rounded-md transition-colors ${buttonColor}`}>
                    Play Again
                </button>
                   <button onClick={onClose} className="px-8 py-3 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-400 transition-colors">
                        Close
                    </button>
            </div>
        </div>
    )
}

const dialogueToToneMap: Record<string, string> = {
    [DIALOGUE.intro]: 'Say this in a confused and scared voice:',
    [DIALOGUE.start]: 'Say this with urgency and desperation:',
    [DIALOGUE.level25]: 'Say this with a shaking, begging voice, as if you are very cold and scared:',
    [DIALOGUE.level50]: 'Say this while panicking and struggling for breath:',
    [DIALOGUE.level75]: 'Say this with extreme desperation, gasping for air between words:',
    [DIALOGUE.level90]: 'Scream this last plea while choking on water, terrified and hopeless:',
    [DIALOGUE.success]: 'Say this with immense joy and relief, breathless at first, as if you just survived something terrible:',
    [DIALOGUE.fail]: 'Whisper this with a defeated, gurgling sound as if you are drowning:',
};
interface GameComponentProps {
    onClose: () => void; // The new function to close the game/modal
    // Add any other props you pass from WorldMap (e.g., userId)
    userId: string;
}


// --- MAIN APP COMPONENT ---

export default function App({ onClose, onGameOver, userId, initialState }: GameComponentProps){
  const [gameState, setGameState] = useState<GameState>(GameState.Intro);
  const [waterLevel, setWaterLevel] = useState(0);
  const [codeLines, setCodeLines] = useState<CodeLine[]>(initialCodeState());
  const [dialogue, setDialogue] = useState(DIALOGUE.intro);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true); // Start by showing the modal
 const [hintUsed, setHintUsed] = useState(false); // To track if a hint was used
  const [finalScore, setFinalScore] = useState<number | null>(null); // To store the calculated score
  const [scoreMessage, setScoreMessage] = useState<string>(''); // For displaying score/hint info
 const [currentHint, setCurrentHint] = useState<string>(''); // For displaying the instruction text
  const startTimeRef = useRef<number>(0); 
const [timeElapsed, setTimeElapsed] = useState<number>(0); // Time in seconds
const timerIntervalRef = useRef<number | null>(null); 

  const tickIntervalRef = useRef<number | null>(null);

  // Game loop for water level
  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    const timer = setInterval(() => {
      setWaterLevel(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setGameState(GameState.Fail);
          return 100;
        }
        return prev + 0.1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [gameState]);

  // Water sound volume effect
  useEffect(() => {
  
  }, [waterLevel, gameState]);

  // Dialogue and state change handler
  useEffect(() => {
    if (gameState === GameState.Playing) {
        if (waterLevel > 90) setDialogue(DIALOGUE.level90);
        else if (waterLevel > 75) setDialogue(DIALOGUE.level75);
        else if (waterLevel > 50) setDialogue(DIALOGUE.level50);
        else if (waterLevel > 25) setDialogue(DIALOGUE.level25);
        else if (waterLevel > 0) setDialogue(DIALOGUE.start);
    } else if (gameState === GameState.Fail) {
        setDialogue(DIALOGUE.fail);
      
        
        setTimeout(() => setShowEndScreen(true), 2000);
    } else if (gameState === GameState.Success) {
        setDialogue(DIALOGUE.success);
       
      setWaterLevel(0); // Drain water on success
        setTimeout(() => setShowEndScreen(true), 4000);
    }
  }, [waterLevel, gameState]);

const startCoreGame = () => {
    // This is the original logic from handleStartGame, but stripped of the modal state change

    // --- TIMER START LOGIC ---
    startTimeRef.current = Date.now(); 
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    
    setGameState(GameState.Playing); // Actually starts the game
}


const handleStartGame = () => {
    // This function will be called by the "BEGIN CHALLENGE" button on the Intro Screen.
    // It should now only show the tutorial.
    // However, since we set showIntroModal: true initially, we just need to start the game directly 
    // from the Intro Modal's "Start" button, so this function should be merged with the Intro Modal's logic.
    // We will simplify: the initial Intro Screen (if using it) is now the Tutorial Modal.
    
    // If the game is already Intro, clicking the main button opens the modal (if you still have an outer Intro button).
    // Let's assume the outer button is the one that calls this.
    setShowIntroModal(true);
}

  
  const handleRestart = () => {
     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    startTimeRef.current = 0;
    setTimeElapsed(0); // Reset time elapsed

   

    setShowEndScreen(false);
    setGameState(GameState.Intro);
    setWaterLevel(0);
    setCodeLines(initialCodeState());
    setDialogue(DIALOGUE.intro);
  }

  const handleCodeChange = useCallback((id: number, value: string) => {
    setCodeLines(prev =>
      prev.map(line => {
        if (line.id === id) {
          // --- LIVE LINTER LOGIC ---
          let newStatus: 'pending' | 'correct' | 'incorrect' = 'pending';
          
          if (line.isBroken) {
            // Trim to ignore leading/trailing whitespace for the check
            const isCorrect = value.trim() === line.correctContent.trim();
            
            // Set status: correct if matched, otherwise incorrect (if value is not empty)
            if (isCorrect) {
              newStatus = 'correct';
            } else if (value.trim().length > 0) {
              // Mark as incorrect only if the user has actually typed something
              newStatus = 'incorrect';
            }
          } else {
             newStatus = 'correct'; // Unbroken lines are always correct
          }
          // --- END LIVE LINTER LOGIC ---
  return { 
            ...line, 
            userAttempt: value, 
            status: newStatus 
          } as CodeLine;
        }
        return line;
      })
    );
       // Clear any active hint or error message since the user is now correcting the code
    setCurrentHint('');
    setScoreMessage('');
        }, []);

  const handleRequestHint = useCallback(() => {
    if(gameState !== GameState.Playing) return;
    
    if(hintUsed) {
        setScoreMessage("Only one major hint is allowed per challenge.");
        return;
    }
    
    const incorrectLines = codeLines.filter(line => line.isBroken && line.status !== 'correct');
    
    if (incorrectLines.length > 0) {
        // playSound('hint'); // REMOVED
        
        setHintUsed(true); 
        setScoreMessage("Hint penalty applied! Review the instructions below to proceed.");
        
        const allInstructions = incorrectLines.map(line => 
            `Line ${line.id}: ${line.instruction}`
        ).join('\n');

        setCurrentHint(allInstructions);
    
    }else{
        setCurrentHint("All broken lines appear to be corrected!");
    }
  }, [codeLines, gameState, hintUsed]); // Removed playSound dependency
  
const handleRunCode = useCallback(() => {
    if(gameState !== GameState.Playing) return;

    setCurrentHint('');
    let allCorrect = true;
    const nextCodeLines = codeLines.map(line => {
        // ... (rest of correctness check logic) ...
        return line;
    });
    setCodeLines(nextCodeLines);

    if (allCorrect) {  
        // ... (1. Timer Stop / Final Time logic) ...
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        const finalTimeInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeElapsed(finalTimeInSeconds); 
        
        // 2. CALCULATE SCORE
        const baseScore = 10000;
        const waterPenalty = Math.round(waterLevel * 8); 
        const hintPenalty = hintUsed ? 5000 : 0; 
        const timePenalty = finalTimeInSeconds * 10; 
        
        const finalCalculatedScore = Math.max(0, baseScore - waterPenalty - hintPenalty - timePenalty);
        
        setFinalScore(finalCalculatedScore);
        onGameOver(finalCalculatedScore); 

        // -----------------------------------------------------
        // 3. CONSTRUCT THE FINAL SCORE MESSAGE AND GRADING
        // -----------------------------------------------------

        // Define Score Tiers
        let gradeMessage = "";
        const maxScoreAchievable = baseScore - waterPenalty - timePenalty; // Score without hint penalty

        if (finalCalculatedScore >= baseScore * 0.7 && !hintUsed) {
            gradeMessage = "Mastery Achieved! Congratulations on mastering the Java basics with speed and precision. You are ready for the next challenge!";
        } else if (finalCalculatedScore >= baseScore * 0.5) {
            gradeMessage = "Strong Performance! You demonstrated a good understanding of the basics. A little more practice on speed will bring mastery.";
        } else {
            gradeMessage = "Keep Practicing! The basics are crucial. Review your syntax and try again to improve your score and mastery of the fundamentals.";
        }

        // Construct the detailed score message (remains the same)
        let message = `Base Score: ${baseScore} Points.`;

        if (hintUsed) {
            message += `\n- Hint Penalty: ${hintPenalty} Points (One major hint used).`;
        } else {
            message += `\n- Performance Bonus: No hint used!`;
        }
        
        message += `\n- Time Penalty: ${timePenalty} Points (${finalTimeInSeconds} seconds elapsed).`;
        message += `\n- Water Level Penalty: ${waterPenalty} Points (${waterLevel.toFixed(1)}% water).`;

        message += `\n\n--- Final Grade ---\n${gradeMessage}`;

        setScoreMessage(message); // Set the final result message
        
        // 4. TTS/AUDIO CLEANUP 
        // ... (rest of the cleanup logic) ...
        
        // 5. FINAL STATE UPDATE
        setGameState(GameState.Success);

        
    } else {
        setScoreMessage("Code run failed. Check the highlighted lines for errors!"); 
    }
  }, [codeLines, gameState, waterLevel, hintUsed, onGameOver]);
   
  const isHintAvailable = useMemo(() => 
        codeLines.some(l => l.isBroken && l.status !== 'correct') && !hintUsed, 
  [codeLines, hintUsed]);
  
  return (
    <main className="w-screen h-screen bg-gray-900 text-white overflow-hidden flex flex-col md:flex-row">
            {/* --- GLOBAL CLOSE BUTTON --- */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white bg-black/50 rounded-full transition-colors"
            aria-label="Close Game"
            title="Close Game"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
 {showIntroModal && (
            <TutorialModal 
                onStart={() => {
                    setShowIntroModal(false); // Close the modal
                    startCoreGame();         // Start the actual game clock/logic
                }}
            />
        )}
        
        {/* --- 2. RENDER MAIN GAME UI --- */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center" style={{backgroundImage: '...'}}>
       <Chamber gameState={gameState} waterLevel={waterLevel} />
        </div>
        
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
            {/* The Intro screen is now replaced by the TutorialModal, so we just render the CodeEditor */}
            {gameState === GameState.Intro ? (
                // If you still have a welcome screen before the modal:
                // <div className="full-screen-intro-placeholder"></div>
                
                // If you want to force the modal to show on load:
                <div className="w-full h-full flex items-center justify-center text-xl text-cyan-300">
                    Loading Challenge... (Will show tutorial next)
                </div>
            ) : (
                <CodeEditor 
                    lines={codeLines} 
                    onCodeChange={handleCodeChange} 
                    onRunCode={handleRunCode} 
                    onRequestHint={handleRequestHint}
                    isDisabled={gameState !== GameState.Playing} 
                    isHintAvailable={isHintAvailable}
                    currentHint={currentHint} // <-- NEW PROP
                />
            )}
        </div>
     {showEndScreen && 
      <EndScreen 
        gameState={gameState} 
        onRestart={handleRestart} 
        onClose={onClose}
        finalScore={finalScore} // <-- NEW
        scoreMessage={scoreMessage} // <-- NEW
         timeElapsed={timeElapsed} 
      />
    }   </main>
  );
}
