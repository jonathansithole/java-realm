// frontend/src/components/Level2BossGame/Level2BossGame.tsx

import { GameState, CodeLine } from './types.ts'; // Assuming types.ts is in a shared location
import { LEVEL2_CHALLENGE_LINES, LEVEL2_DIALOGUE } from './constants.ts'; // NEW IMPORT
import React, { useState, useEffect, useRef , useCallback, useMemo} from 'react';

// --- CONFIGURATION & INITIALIZATION ---
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string; // Retained for structure

const initialCodeState = (): CodeLine[] => JSON.parse(JSON.stringify(LEVEL2_CHALLENGE_LINES));

// --- COMPONENT INTERFACES (Moved to Top) ---
interface TutorialModalProps { onStart: () => void; }
interface EndScreenProps { gameState: GameState; onRestart: () => void; onClose: () => void; finalScore: number | null; scoreMessage: string; timeElapsed: number; }
interface GameComponentProps { onClose: () => void; onGameOver: (finalScore: number) => void; userId: string; initialState: { xp: number }; }
interface ChamberProps { gameState: GameState; ceilingLevel: number; }
interface CodeEditorProps { 
  lines: CodeLine[]; 
  onCodeChange: (id: number, value: string) => void; 
  onRunCode: () => void; 
  onRequestHint: () => void; 
  isDisabled: boolean; 
  isHintAvailable: boolean; 
  currentHint: string; 
}

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


// --- HELPER & UI COMPONENTS ---

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

// Inside Chamber component:

// --- START OF CHAMBER COMPONENT (LOGIC FIXED) ---
const Chamber: React.FC<ChamberProps> = ({ gameState, ceilingLevel }) => {
  const isReleased = gameState === GameState.Success;
  const isSealed = gameState === GameState.Fail;

  // 🛑 THE KEY FIX: The drop percentage should directly map to ceilingLevel.
  // 0% drop (Up) when ceilingLevel is 0.
  // 100% drop (Down) when ceilingLevel is 100.
  const barsDrop = ceilingLevel; 
  
  // Note: The Tailwind class h-8 corresponds to 2rem (32px).

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <FloatingRunes />

      {/* 1. MAIN PRISON CELL CONTAINER (Square, Flat Bottom) */}
      <div className={`relative w-40 h-80 md:w-56 md:h-[28rem] border-4 border-gray-700/50 backdrop-blur-sm shadow-xl overflow-hidden bg-gray-900`}>

        {/* BACKGROUND EFFECT (The Room) */}
        <div className="absolute inset-0 bg-gray-900" style={{ background: 'radial-gradient(ellipse at center, #1c1c1c 0%, #000 100%)' }}>
          <div className={`absolute inset-0 transition-opacity duration-500`} style={{ opacity: isReleased ? 0.9 : 0.2, boxShadow: `0 0 50px 10px ${isReleased ? 'gold' : 'cyan'} inset` }}></div>
        </div>

        {/* --- MAN FIGURE (STATIC, BEHIND BARS) --- */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-32 text-gray-400 text-6xl z-10">
          🧑‍💻
        </div>

        {/* --- BARS MECHANISM (The MOVING PART) --- */}
        <div
          className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-linear z-20"
          style={{ transform: `translateY(${barsDrop}%)` }}
        >
          {/* The Ceiling Plate itself (h-8 = 2rem) */}
          <div
            className={`absolute top-0 left-0 w-full h-8 bg-gray-600/80 border-b-4 transition-colors duration-1000 ${isReleased ? 'border-yellow-400' : 'border-gray-400'}`}
            style={{
              boxShadow: `0 0 15px ${isReleased ? 'gold' : 'cyan'}`
            }}
          >
            <div className="text-gray-200 text-sm mt-1 text-center font-mono">
              ⚙️ GATE CLOSING...
            </div>
          </div>

          {/* The Vertical Bars Container: Starts below the ceiling plate (top-8) and fills the remaining height. */}
          <div
            className="absolute top-8 left-0 w-full"
            style={{ height: `calc(100% - 2rem)` }} // Correct height calculation
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 bg-gray-600/80 h-full border-r border-gray-700"
                style={{ left: `${20 * (i + 1)}%`, transform: 'translateX(-50%)' }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floor (The base where the bars land) */}
        <div className={`absolute bottom-0 left-0 w-full h-2 bg-gray-500 transition-colors duration-500 ${isSealed ? 'bg-red-600' : ''} z-30`}></div>
      </div>
    </div>
  );
};

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
    <div className="w-full h-full bg-gray-900/80 backdrop-blur-md border-l-2 border-cyan-500/30 p-2 flex flex-col"> 
      <div className="p-2 border-b border-gray-700"><h2 className="text-md font-bold text-cyan-300">OBJECTIVE:</h2><p className="text-cyan-100/80 text-xs">Fix the code. The ceiling will continue lowering until the program runs successfully.</p></div>
      {currentHint && (
        <div className="bg-yellow-900/50 border-l-4 border-yellow-400 p-2 my-2 rounded-md shadow-inner text-xs">
            <p className="font-semibold text-yellow-200">HINT:</p>
            <p className="text-yellow-100 italic" style={{ whiteSpace: 'pre-wrap' }}>{currentHint}</p>
        </div>
      )}
      <div className="flex-grow max-h-[calc(100vh-220px)] bg-black/50 rounded-md p-2 font-mono text-xs overflow-auto"> 
        <pre>
        {lines.map((line) => (
            <div key={line.id} className="flex items-center">
              <span className="text-gray-600 w-6 text-right pr-2">{line.id}</span>
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
        <button onClick={onRequestHint} disabled={isDisabled || !isHintAvailable} className="flex-grow py-2 px-4 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600 transition disabled:bg-gray-800 disabled:text-gray-500 shadow-md">GET HINT</button>
        <button onClick={onRunCode} disabled={isDisabled} className="flex-grow py-2 px-4 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 active:bg-cyan-700 transition shadow-lg">RUN CODE</button>
      </div>
    </div>
  );
};


const TutorialModal: React.FC<TutorialModalProps> = ({ onStart }) => {
    const [stepIndex, setStepIndex] = useState(0); 

    const tutorialSteps = useMemo(() => [
        { title: "Welcome to the Ceiling of Compression", text: "The chamber is closing! Your mission is to fix the code logic errors to raise the ceiling before it locks the chamber and forces a restart.", icon: "🌊" },
        { title: "Live Linter Feedback", text: (<><p>The editor provides **instant, line-by-line feedback** as you type. Pay close attention to the color changes:</p><ul className="list-disc list-inside ml-4 mt-2 text-left"><li className="text-green-400">**GREEN** code is syntactically correct.</li><li className="text-red-400">**RED** code is syntactically wrong (but editable).</li><li className="text-yellow-300">**YELLOW** lines are the broken parts you must correct.</li></ul></>), icon: "🚦" },
        { title: "Scoring & The Timer", text: "Your final score is based on a few factors: Base Score - Time Penalty - Ceiling Penalty - Hint Penalty. Efficiency and speed are key!", icon: "⏱️" },
        { title: "The Hint Penalty", text: "You can use the 'GET HINT' button once to reveal all required fixes. This incurs a massive score penalty, so use it only as a last resort.", icon: "💡" },
        { title: "Ready to Begin", text: "Good luck! The clock starts as soon as you press the button below.", icon: "🚀" },
    ], []);

    const currentStep = tutorialSteps[stepIndex];
    const isFirstStep = stepIndex === 0;
    const isReadyToStart = stepIndex === tutorialSteps.length - 1;

    const handleNext = () => { if (isReadyToStart) { onStart(); } else { setStepIndex(prev => prev + 1); } };
    const handleBack = () => { if (!isFirstStep) { setStepIndex(prev => prev - 1); } };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg shadow-2xl p-8 text-center w-11/12 max-w-lg">
                <div className="text-cyan-400 mb-4 text-4xl animate-pulse">{currentStep.icon}</div>
                <h1 className="text-3xl font-extrabold text-white mb-3">{currentStep.title}</h1>
                <div className="text-gray-300 mb-8 text-md text-center">{currentStep.text}</div>
                <div className="flex justify-between items-center mt-6">
                    <button onClick={handleBack} disabled={isFirstStep} className="py-2 px-4 text-white font-bold rounded-md transition-colors bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500">PREV</button>
                    <button onClick={handleNext} className={`py-3 px-8 text-white font-bold rounded-md transition-all duration-300 ${isReadyToStart ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.4)]'}`}>
                        {isReadyToStart ? 'START CHALLENGE' : 'NEXT STEP'}
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">Step {stepIndex + 1} of {tutorialSteps.length}</p>
            </div>
        </div>
    );
};


const EndScreen: React.FC<EndScreenProps> = ({ gameState, onRestart, onClose, finalScore, scoreMessage, timeElapsed }) => { 
    if (gameState !== GameState.Success && gameState !== GameState.Fail) return null;
    const isSuccess = gameState === GameState.Success;
    const title = isSuccess ? "Compression Chamber Released" : "Chamber Locked";
    const subtitle = isSuccess ? "You successfully bypassed the magical compression seal!" : LEVEL2_DIALOGUE.fail;
    const borderColor = isSuccess ? "border-green-500" : "border-red-500";
    const textColor = isSuccess ? "text-green-300" : "text-red-300";

    return (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`bg-gray-800 border-2 ${borderColor} rounded-lg shadow-2xl p-8 text-center w-11/12 max-w-md`}>
                <h1 className={`text-4xl font-bold ${textColor} mb-2`}>{title}</h1>
                <p className="text-gray-300 mb-6">{subtitle}</p>

                {isSuccess && finalScore !== null && (
                    <div className="bg-gray-700 p-4 rounded-md mb-4">
                        <p className="text-lg font-extrabold text-white">Time Taken: <span className="text-cyan-400">{formatTime(timeElapsed)}</span></p>
                        <p className="text-xl font-extrabold text-white mt-1">Final Score: <span className="text-green-400">{finalScore}</span></p>
                        {scoreMessage && (<p className="text-sm text-yellow-300 mt-2" style={{ whiteSpace: 'pre-wrap' }}>{scoreMessage}</p>)}
                    </div>
                )}
                <div className="flex justify-center gap-4 mt-4">
                    <button onClick={onRestart} className={`px-8 py-3 text-white font-bold rounded-md transition-colors ${isSuccess ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                        {isSuccess ? 'NEXT WORLD' : 'TRY AGAIN'}
                    </button>
                    <button onClick={onClose} className="px-8 py-3 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-400 transition-colors">Close</button>
                </div>
            </div>
        </div>
    )
}


// --- MAIN APP COMPONENT ---

export default function App({ onClose, onGameOver, userId, initialState }: GameComponentProps){
  const [gameState, setGameState] = useState<GameState>(GameState.Intro);
  const [ceilingLevel, setCeilingLevel] = useState(100);
  const [codeLines, setCodeLines] = useState<CodeLine[]>(initialCodeState());
  const [dialogue, setDialogue] = useState(LEVEL2_DIALOGUE.intro);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [hintUsed, setHintUsed] = useState(false); 
  const [finalScore, setFinalScore] = useState<number | null>(null); 
  const [scoreMessage, setScoreMessage] = useState<string>(''); 
  const [currentHint, setCurrentHint] = useState<string>(''); 
  const startTimeRef = useRef<number>(0); 
  const [timeElapsed, setTimeElapsed] = useState<number>(0); 
  const timerIntervalRef = useRef<number | null>(null); 

  // Game loop for ceiling level
  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    const timer = setInterval(() => {
      setCeilingLevel(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setGameState(GameState.Fail);
          return 0;
        }
        return prev - 0.1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [gameState]);


  // Dialogue and state change handler
  useEffect(() => {
    if (gameState === GameState.Playing) {
        if (ceilingLevel < 10) setDialogue(LEVEL2_DIALOGUE.level90);
        else if (ceilingLevel < 25) setDialogue(LEVEL2_DIALOGUE.level75);
        else if (ceilingLevel < 50) setDialogue(LEVEL2_DIALOGUE.level50);
        else if (ceilingLevel < 75) setDialogue(LEVEL2_DIALOGUE.level25);
        else if (ceilingLevel < 100) setDialogue(LEVEL2_DIALOGUE.start);
    } else if (gameState === GameState.Fail) {
        setDialogue(LEVEL2_DIALOGUE.fail);
        setCeilingLevel(100); 
        setTimeout(() => setShowEndScreen(true), 2000); 
    } else if (gameState === GameState.Success) {
        setDialogue(LEVEL2_DIALOGUE.success);
        setCeilingLevel(100); 
        setTimeout(() => setShowEndScreen(true), 4000);
    }
  }, [ceilingLevel, gameState]);


  const startCoreGame = () => {
    // --- TIMER START LOGIC ---
    startTimeRef.current = Date.now(); 
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    
    setCeilingLevel(100); 
    setGameState(GameState.Playing); 
  }


  const handleStartGame = () => {
    setShowIntroModal(true);
  }
  
  const handleRestart = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    startTimeRef.current = 0;
    setTimeElapsed(0); 

    setShowEndScreen(false);
    setGameState(GameState.Intro);
    setCeilingLevel(100);
    setCodeLines(initialCodeState());
    setDialogue(LEVEL2_DIALOGUE.intro);
  }

  const handleCodeChange = useCallback((id: number, value: string) => {
    setCodeLines(prev =>
      prev.map(line => {
        if (line.id === id) {
          let newStatus: 'pending' | 'correct' | 'incorrect' = 'pending';
          if (line.isBroken) {
            const isCorrect = value.trim() === line.correctContent.trim();
            if (isCorrect) {
              newStatus = 'correct';
            } else if (value.trim().length > 0) {
              newStatus = 'incorrect';
            }
          } else { newStatus = 'correct'; }
          return { ...line, userAttempt: value, status: newStatus } as CodeLine;
        }
        return line;
      })
    );
    setCurrentHint('');
    setScoreMessage('');
  }, []);

  const handleRequestHint = useCallback(() => {
    if(gameState !== GameState.Playing) return;
    if(hintUsed) { setScoreMessage("Only one major hint is allowed per challenge."); }
    
    const incorrectLines = codeLines.filter(line => line.isBroken && line.status !== 'correct');
    if (incorrectLines.length > 0) {
        if (!hintUsed) {
            setHintUsed(true); 
            setScoreMessage("Hint penalty applied! Review the instructions below to proceed.");
        }
        const allInstructions = incorrectLines.map(line => `Line ${line.id}: ${line.instruction}`).join('\n');
        setCurrentHint(allInstructions);
    }else{
        setCurrentHint("All broken lines appear to be corrected!");
    }
  }, [codeLines, gameState, hintUsed]);

  const handleRunCode = useCallback(() => {
    if(gameState !== GameState.Playing) return;

    setCurrentHint('');
    let allCorrect = true;
    const nextCodeLines = codeLines.map(line => {
      if (line.isBroken) {
        const isCorrect = line.userAttempt.trim() === line.correctContent.trim();
        if (!isCorrect) allCorrect = false;
        return { ...line, status: isCorrect ? 'correct' : 'incorrect' } as CodeLine;
      }
      return line;
    });
    setCodeLines(nextCodeLines);

    if (allCorrect) {  
        // 1. STOP TIMER AND RECORD TIME
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        const finalTimeInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeElapsed(finalTimeInSeconds); 
        
        // 2. CALCULATE SCORE
        const baseScore = 12000;
        const ceilingPenalty = Math.round((100 - ceilingLevel) * 10); 
        const hintPenalty = hintUsed ? 5000 : 0; 
        const timePenalty = finalTimeInSeconds * 10; 
        
        const finalCalculatedScore = Math.max(0, baseScore - ceilingPenalty - hintPenalty - timePenalty);
        
        setFinalScore(finalCalculatedScore);
        onGameOver(finalCalculatedScore); 

        // 3. CONSTRUCT THE FINAL SCORE MESSAGE
        let message = `Base Score: ${baseScore} Points.`;

        if (hintUsed) { message += `\n- Hint Penalty: ${hintPenalty} Points (One major hint used).`; } else { message += `\n- Performance Bonus: No hint used!`; }
        message += `\n- Time Penalty: ${timePenalty} Points (${finalTimeInSeconds} seconds elapsed).`;
        message += `\n- Ceiling Penalty: ${ceilingPenalty} Points (${(100 - ceilingLevel).toFixed(1)}% drop).`;

        let gradeMessage = "";
        if (finalCalculatedScore >= baseScore * 0.7 && !hintUsed) { gradeMessage = "Mastery Achieved! Congratulations on mastering the flow control basics with speed and precision. You are ready for the next challenge!"; } 
        else if (finalCalculatedScore >= baseScore * 0.5) { gradeMessage = "Strong Performance! You demonstrated a good understanding of the basics. A little more practice on speed will bring mastery."; } 
        else { gradeMessage = "Keep Practicing! The basics are crucial. Review your logic and try again to improve your score and mastery of the fundamentals."; }
        message += `\n\n--- Final Grade ---\n${gradeMessage}`;

        setScoreMessage(message); 
        setGameState(GameState.Success);
        
    } else {
      setScoreMessage("Code run failed. Check the highlighted lines for errors!"); 
    }
  }, [codeLines, gameState, ceilingLevel, hintUsed, onGameOver]);
   
  const isHintAvailable = useMemo(() => codeLines.some(l => l.isBroken && l.status !== 'correct') && !hintUsed, [codeLines, hintUsed]);
  
  function onRequestHint(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <main className="w-screen h-screen bg-gray-900 text-white overflow-hidden flex flex-col md:flex-row">
            {/* --- GLOBAL CLOSE BUTTON --- */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white bg-black/50 rounded-full transition-colors" aria-label="Close Game" title="Close Game">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        {showIntroModal && (
            <TutorialModal 
                onStart={() => {
                    setShowIntroModal(false); 
                    startCoreGame();         
                }}
            />
        )}
        
        {/* --- 2. RENDER MAIN GAME UI --- */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center flex flex-col items-center justify-center relative" style={{backgroundImage: 'radial-gradient(circle at center, #303030 0%, #101010 70%)'}}>
            
            {/* --- DIALOGUE DISPLAY FIX: POSITIONED HERE --- */}
            {/* The dialogue prop is now pulled from the App state */}
            {gameState !== GameState.Success && gameState !== GameState.Fail && dialogue && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-11/12 max-w-lg p-3 bg-black/70 text-cyan-200 border border-cyan-700 rounded-lg text-center shadow-lg transition-opacity duration-500 z-10">
                   
                    <p className="italic">{dialogue}</p> {/* <-- USE THE STATE VARIABLE HERE */}
                </div>
            )}
            
            <Chamber gameState={gameState} ceilingLevel={ceilingLevel} />
        </div>
        
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
            {gameState === GameState.Intro ? (
                <div className="w-full h-full flex items-center justify-center text-xl text-cyan-300">
                    Loading Challenge... (Will show tutorial next)
                </div>
            ) : (
                <CodeEditor 
                    lines={codeLines} 
                    onCodeChange={handleCodeChange} 
                    onRunCode={handleRunCode} 
                    onRequestHint={onRequestHint}
                    isDisabled={gameState !== GameState.Playing} 
                    isHintAvailable={isHintAvailable}
                    currentHint={currentHint} 
                />
            )}
        </div>
     {showEndScreen && 
      <EndScreen 
        gameState={gameState} 
        onRestart={handleRestart} 
        onClose={onClose}
        finalScore={finalScore} 
        scoreMessage={scoreMessage} 
         timeElapsed={timeElapsed} 
      />
    }   </main>
  );
}