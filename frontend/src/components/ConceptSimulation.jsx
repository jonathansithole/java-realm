import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, RotateCcw, ArrowRight, CheckCircle, 
  XCircle, Cpu, Zap, Lock, Unlock, Database 
} from 'lucide-react';

// --- SHARED COMPONENT: SYNTAX BRIDGE ---
const SyntaxBridge = ({ code, activeLine }) => {
    return (
        <div className="font-mono text-[10px] md:text-xs bg-slate-100 dark:bg-black/50 p-3 rounded-lg border border-slate-300 dark:border-slate-700/50 mb-4 shadow-inner text-slate-700 dark:text-slate-300 transition-colors">
            <div className="flex justify-between text-slate-400 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                <span>CODE PREVIEW</span>
                <span>main.js</span>
            </div>
            {code.map((line, index) => (
                <div key={index} className={`relative px-2 py-0.5 transition-colors duration-300 ${activeLine === index ? 'bg-indigo-100 dark:bg-indigo-500/20' : ''}`}>
                    {activeLine === index && (
                        <motion.div 
                            layoutId="active-line-indicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"
                        />
                    )}
                    <span className="text-slate-400 mr-3 select-none w-4 inline-block text-right">{index + 1}</span>
                    <span className={activeLine === index ? 'text-indigo-700 dark:text-indigo-200 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                        {line}
                    </span>
                </div>
            ))}
        </div>
    );
};

// --- SHARED COMPONENT: MICRO QUIZ ---
const MicroQuiz = ({ question, options, correctAnswer, onCorrect }) => {
    const [selected, setSelected] = useState(null);
    const [isSolved, setIsSolved] = useState(false);

    const handleSelect = (idx) => {
        setSelected(idx);
        if (idx === correctAnswer) {
            setIsSolved(true);
            if (onCorrect) onCorrect();
        }
    };

    return (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                <Zap size={12} className="text-yellow-500" /> Knowledge Check
            </h5>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">{question}</p>
            <div className="grid gap-2">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        disabled={isSolved}
                        onClick={() => handleSelect(i)}
                        className={`text-left text-xs px-3 py-2.5 rounded border transition-all relative ${
                            selected === i 
                                ? i === correctAnswer 
                                    ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-300' 
                                    : 'bg-red-100 dark:bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        {selected === i && i === correctAnswer && <CheckCircle size={14} className="absolute right-3 top-2.5 text-emerald-500" />}
                        {selected === i && i !== correctAnswer && <XCircle size={14} className="absolute right-3 top-2.5 text-red-500" />}
                        <span className="pr-6 block">{opt}</span>
                    </button>
                ))}
            </div>
            {isSolved && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> DATA UPLOAD COMPLETE. CONCEPT VERIFIED.
                </motion.div>
            )}
        </div>
    );
};

// --- SUB-SIMULATION: VARIABLES ---
const VariableSimulation = () => {
    const [value, setValue] = useState("Player1");
    
    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-gradient-to-r dark:from-slate-900 dark:to-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5"><Database size={48} /></div>
                <h3 className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1 uppercase tracking-wider">Concept: Data Storage</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Computer memory is like a massive warehouse of empty boxes. 
                    A <strong>Variable</strong> is when you claim a box, label it (give it a name), and put something inside so you can find it later.
                </p>
            </div>

            <div className="bg-white dark:bg-[#0B0F19] p-4 rounded-xl border border-slate-200 dark:border-slate-800 relative shadow-sm">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col items-center justify-center space-y-4 py-2">
                        <div className="relative group">
                            <motion.div 
                                layout
                                className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center relative z-10"
                            >
                                <AnimatePresence mode='wait'>
                                    <motion.div 
                                        key={value}
                                        initial={{ scale: 0, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="text-yellow-600 dark:text-yellow-400 font-bold text-sm bg-white dark:bg-slate-900 px-3 py-1 rounded border border-yellow-500/30 shadow-sm"
                                    >
                                        "{value}"
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded font-mono z-20 shadow-lg border border-indigo-400">
                                username
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] text-slate-500 font-mono">Input:</span>
                            <input 
                                type="text" 
                                maxLength={8}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs px-2 py-1 rounded w-24 outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-300 dark:border-slate-700 font-mono"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <SyntaxBridge 
                            code={[
                                `// 1. Create the box`,
                                `let username;`,
                                `// 2. Put data inside`,
                                `username = "${value}";`
                            ]}
                            activeLine={3} 
                        />
                    </div>
                </div>
            </div>

            <MicroQuiz 
                question="If you change the content of the variable 'username', what happens to the old data?"
                options={["It stays there forever", "It is overwritten (deleted)", "It moves to a new box"]}
                correctAnswer={1}
            />
        </div>
    );
};

// --- SUB-SIMULATION: LOOPS ---
const LoopSimulation = () => {
    const [step, setStep] = useState(0);
    const maxSteps = 3;

    const nextStep = () => {
        setStep((prev) => (prev >= maxSteps ? 0 : prev + 1));
    };

    const getActiveLine = () => {
        if (step === 0) return 0; 
        if (step <= maxSteps) return 2; 
        return 3; 
    };

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-gradient-to-r dark:from-slate-900 dark:to-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5"><RotateCcw size={48} /></div>
                <h3 className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1 uppercase tracking-wider">Concept: Automation</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Programmers are lazy. Instead of writing the same code 100 times, we use a <strong>Loop</strong>. 
                    It's like a factory conveyor belt: it repeats an action until a condition tells it to stop.
                </p>
            </div>

            <div className="bg-white dark:bg-[#0B0F19] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <SyntaxBridge 
                    code={[
                        `let count = 0;`,
                        `while (count < ${maxSteps}) {`,
                        `  count = count + 1;`,
                        `}`
                    ]}
                    activeLine={getActiveLine()}
                />

                <div className="relative h-20 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-around px-4 overflow-hidden mb-4">
                    <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2" />
                    
                    {[1, 2, 3].map((item) => (
                        <motion.div 
                            key={item}
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-500 ${
                                step >= item 
                                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-md' 
                                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-600'
                            }`}
                        >
                            {step >= item ? <CheckCircle size={14}/> : item}
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-[10px] font-mono text-slate-500">
                        MEM: <span className="text-indigo-500">count = {step}</span>
                    </div>
                    <button 
                        onClick={nextStep}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold px-3 py-2 rounded flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
                    >
                        {step >= maxSteps ? <RotateCcw size={12}/> : <ArrowRight size={12}/>}
                        {step >= maxSteps ? "Reset Simulation" : "Next Step"}
                    </button>
                </div>
            </div>

            <MicroQuiz 
                question="What actually stops the loop from running forever?"
                options={["The computer gets tired", "The Condition (count < 3) becomes false", "Loops always run exactly 3 times"]}
                correctAnswer={1}
            />
        </div>
    );
};

// --- SUB-SIMULATION: CONDITIONS ---
const ConditionSimulation = () => {
    const [hasKey, setHasKey] = useState(false);

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-gradient-to-r dark:from-slate-900 dark:to-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5"><Lock size={48} /></div>
                <h3 className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1 uppercase tracking-wider">Concept: Logic Gates</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Code needs to make decisions. An <strong>If Statement</strong> is like a security gate. 
                    It asks a question (True or False?). If True, the gate opens. If False, it stays closed (or goes to 'Else').
                </p>
            </div>

            <div className="bg-white dark:bg-[#0B0F19] p-4 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 gap-4 shadow-sm">
                
                <div className="flex flex-col items-center justify-between h-full bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setHasKey(!hasKey)}
                        className={`w-full py-2 px-4 rounded border transition-all flex items-center justify-center gap-2 text-[10px] font-bold tracking-wider ${
                            hasKey ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                        }`}
                    >
                        {hasKey ? <Box size={14} /> : <Box size={14} className="opacity-50"/>}
                        {hasKey ? "INVENTORY: [KEY_CARD]" : "INVENTORY: [EMPTY]"}
                    </button>

                    <div className="relative flex-grow w-full flex items-center justify-center my-6">
                            <motion.div 
                            animate={{ 
                                borderColor: hasKey ? '#10b981' : '#ef4444',
                                backgroundColor: hasKey ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                scale: hasKey ? 1.1 : 1
                            }}
                            className="w-16 h-16 rounded-xl border-4 flex items-center justify-center transition-all duration-500"
                            >
                            {hasKey ? <Unlock size={24} className="text-emerald-500"/> : <Lock size={24} className="text-red-500"/>}
                            </motion.div>

                            <motion.div 
                            className={`absolute -bottom-4 text-[9px] font-mono px-2 py-0.5 rounded ${hasKey ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'}`}
                            >
                            {hasKey ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                            </motion.div>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <SyntaxBridge 
                        code={[
                            `let hasKey = ${hasKey};`,
                            ``,
                            `if (hasKey) {`,
                            `  openGate();`,
                            `} else {`,
                            `  soundAlarm();`,
                            `}`
                        ]}
                        activeLine={hasKey ? 3 : 5}
                    />
                </div>
            </div>

            <MicroQuiz 
                question="When does the code inside the 'else' block run?"
                options={["Always runs", "When the 'if' condition is TRUE", "When the 'if' condition is FALSE"]}
                correctAnswer={2}
            />
        </div>
    );
};

// --- MAIN SIMULATION ENGINE ---
const ConceptSimulation = ({ levelTitle }) => {
    const conceptKey = levelTitle?.toLowerCase() || "";

    if (conceptKey.includes('variable') || conceptKey.includes('storage') || conceptKey.includes('let')) {
        return <VariableSimulation />;
    }

    if (conceptKey.includes('loop') || conceptKey.includes('iteration') || conceptKey.includes('repeat')) {
        return <LoopSimulation />;
    }

    if (conceptKey.includes('condition') || conceptKey.includes('if')) {
        return <ConditionSimulation />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-full mb-4 animate-pulse">
                <Cpu size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-slate-800 dark:text-white font-bold mb-2 text-sm">Analyzing Simulation...</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs">
                Visualize the code in your mind. Break the problem into small steps. You are the compiler.
            </p>
        </div>
    );
};

export default ConceptSimulation;