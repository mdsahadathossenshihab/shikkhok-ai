import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { evaluate, format, typeOf } from 'mathjs';
import katex from 'katex';

// ==========================================
// TYPES & INTERFACES
// ==========================================

type CalculatorMode = 'COMP' | 'CMPLX' | 'STAT' | 'EQN' | 'MATRIX' | 'VECTOR';
type AngleUnit = 'DEG' | 'RAD' | 'GRA';

interface CalculatorProps {
    onClose: () => void;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const formatToLatex = (input: string): string => {
    if (!input) return '';
    
    // Basic replacements for visual symbols to LaTeX
    let latex = input
        .replace(/\*/g, '\\times ')
        .replace(/\//g, '\\div ')
        .replace(/pi/g, '\\pi ')
        .replace(/sqrt\(/g, '\\sqrt{')
        .replace(/cbrt\(/g, '\\sqrt[3]{')
        .replace(/asin\(/g, '\\sin^{-1}(')
        .replace(/acos\(/g, '\\cos^{-1}(')
        .replace(/atan\(/g, '\\tan^{-1}(')
        .replace(/sin\(/g, '\\sin(')
        .replace(/cos\(/g, '\\cos(')
        .replace(/tan\(/g, '\\tan(')
        .replace(/log\(/g, '\\log(')
        .replace(/ln\(/g, '\\ln(')
        .replace(/\^2/g, '^2')
        .replace(/\^3/g, '^3');

    return latex;
};

// ==========================================
// COMPONENT
// ==========================================

export const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
    // State
    const [input, setInput] = useState(''); // The raw string for mathjs
    const [result, setResult] = useState('');
    
    const [mode, setMode] = useState<CalculatorMode>('COMP');
    const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
    const [isShift, setIsShift] = useState(false);
    const [isAlpha, setIsAlpha] = useState(false);
    const [showModeMenu, setShowModeMenu] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [history, setHistory] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Refs for rendering math
    const displayRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    // ==========================================
    // RENDER EFFECTS
    // ==========================================

    useEffect(() => {
        // Render Input LaTeX
        if (displayRef.current) {
            try {
                const cleanInput = formatToLatex(input) || '\\text{ }';
                // Ensure katex is available and valid before calling render
                if (typeof katex !== 'undefined' && katex.render) {
                    katex.render(cleanInput, displayRef.current, {
                        throwOnError: false,
                        displayMode: false,
                        trust: true,
                        strict: false // Don't throw on warnings
                    });
                } else {
                    displayRef.current.innerText = input || '0';
                }
            } catch (e) {
                console.warn("KaTeX Render Error:", e);
                if (displayRef.current) {
                    displayRef.current.innerText = input || '0';
                }
            }
        }
    }, [input]);

    useEffect(() => {
        // Render Result LaTeX
        if (resultRef.current) {
            try {
                if (result && typeof katex !== 'undefined' && katex.render) {
                    katex.render(formatToLatex(result), resultRef.current, {
                        throwOnError: false,
                        displayMode: false,
                        strict: false
                    });
                } else {
                    resultRef.current.innerText = result;
                }
            } catch (e) {
                console.warn("KaTeX Result Render Error:", e);
                if (resultRef.current) {
                    resultRef.current.innerText = result;
                }
            }
        }
    }, [result]);

    // ==========================================
    // LOGIC HANDLERS
    // ==========================================

    const handleKeyPress = (val: string, type: 'num' | 'op' | 'func' | 'var' = 'num') => {
        // Reset Shift/Alpha after one press
        if (isShift) setIsShift(false);
        if (isAlpha) setIsAlpha(false);

        // Clear result if typing new number after calculation
        if (result && !['+', '-', '*', '/', '^'].includes(val) && type === 'num') {
            setInput(val);
            setResult('');
        } else {
            // Specific handling for functions to add parenthesis
            if (type === 'func') {
                setInput(prev => prev + val + '(');
            } else {
                setInput(prev => prev + val);
            }
        }
    };

    const handleClear = () => {
        setInput('');
        setResult('');
        setIsShift(false);
        setIsAlpha(false);
    };

    const handleDelete = () => {
        setInput(prev => prev.slice(0, -1));
    };

    const handleCalculate = () => {
        try {
            if (!input) return;

            let expression = input;

            // 1. Handle Angle Units (Deg -> Rad conversion for trig functions)
            if (angleUnit === 'DEG') {
                expression = expression
                    .replace(/sin\(/g, 'sin(') 
                    .replace(/cos\(/g, 'cos(')
                    .replace(/tan\(/g, 'tan(');
            }

            // Replace symbols for mathjs
            const evalExpr = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'pi')
                .replace(/√\(/g, 'sqrt(')
                .replace(/e\^/g, 'exp')
                .replace(/ln\(/g, 'log(')
                .replace(/log\(/g, 'log10(');

            // Common scope for unit conversions if needed
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const scope: any = {};
            
            if (angleUnit === 'DEG') {
                 const degToRad = (n: number) => n * (Math.PI / 180);
                 // Override trig functions in scope
                 scope.sin = (x: number) => Math.sin(degToRad(x));
                 scope.cos = (x: number) => Math.cos(degToRad(x));
                 scope.tan = (x: number) => Math.tan(degToRad(x));
                 scope.asin = (x: number) => (Math.asin(x) * 180) / Math.PI;
                 scope.acos = (x: number) => (Math.acos(x) * 180) / Math.PI;
                 scope.atan = (x: number) => (Math.atan(x) * 180) / Math.PI;
            }

            // Use standalone evaluate function
            const res = evaluate(evalExpr, scope);

            // Formatting Result
            let finalResult = '';
            const resultType = typeOf(res);

            if (resultType === 'Complex') {
                 finalResult = format(res, { precision: 4 });
            } else if (resultType === 'Matrix' || Array.isArray(res)) {
                 finalResult = format(res);
            } else {
                 finalResult = format(res, { precision: 10 });
            }

            setResult(finalResult);
            
            // Add to history
            setHistory(prev => [...prev, input]);
            setHistoryIndex(history.length);

        } catch (err) {
            console.error(err);
            setResult('Math Error');
        }
    };

    const handleModeSelect = (m: CalculatorMode) => {
        setMode(m);
        setShowModeMenu(false);
        handleClear();
    };

    // ==========================================
    // KEYPAD COMPONENTS
    // ==========================================

    const SmallBtn = ({ label, shift, alpha, onClick, color = "bg-slate-700" }: { label: string, shift?: string, alpha?: string, onClick: () => void, color?: string }) => (
        <div className="flex flex-col items-center gap-0.5">
            <div className="flex justify-between w-full px-1 text-[8px] font-bold h-3">
                <span className="text-yellow-400">{shift}</span>
                <span className="text-red-400">{alpha}</span>
            </div>
            <button 
                onClick={onClick}
                className={`w-full h-8 md:h-10 rounded-t-md rounded-b-[40%] ${color} text-white shadow-[0_2px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center text-xs md:text-sm font-medium border-b-2 border-black/20`}
            >
                {label}
            </button>
        </div>
    );

    const MainBtn = ({ label, onClick, className = "bg-white text-black" }: { label: React.ReactNode, onClick: () => void, className?: string }) => (
        <button 
            onClick={onClick}
            className={`w-full h-10 md:h-12 rounded-lg shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center text-lg font-bold ${className}`}
        >
            {label}
        </button>
    );

    return (
        <div className="w-full max-w-md mx-auto bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-700 flex flex-col h-[90vh] md:h-auto relative">
            
            {/* TOP BAR: Solar Panel & Branding */}
            <div className="bg-slate-700 p-2 flex justify-between items-center border-b border-slate-900">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold tracking-widest">CASIO</span>
                    <span className="text-white text-xs font-bold italic font-mono">fx-991ES PLUS</span>
                    <span className="text-cyan-400 text-[9px] tracking-tighter">NATURAL-V.P.A.M.</span>
                </div>
                <div className="w-16 h-6 bg-[#4a3b32] rounded border border-slate-600 shadow-inner opacity-80 flex items-center justify-center overflow-hidden">
                    <div className="grid grid-cols-4 gap-px w-full h-full opacity-30">
                         {[...Array(4)].map((_,i) => <div key={i} className="bg-amber-900/50 h-full w-full border-r border-black/20"></div>)}
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* DISPLAY SCREEN */}
            <div className="bg-[#c2dcc0] p-3 md:p-4 border-x-8 border-y-4 border-slate-800 shadow-inner min-h-[120px] flex flex-col relative font-mono">
                {/* Indicators */}
                <div className="flex justify-between text-[9px] text-slate-800 font-bold mb-1 border-b border-slate-800/10 pb-1">
                    <div className="flex gap-2">
                        {isShift && <span className="bg-slate-800 text-[#c2dcc0] px-1">S</span>}
                        {isAlpha && <span className="bg-slate-800 text-[#c2dcc0] px-1">A</span>}
                        <span>{mode}</span>
                        <span>{angleUnit}</span>
                        <span>Math</span>
                    </div>
                    <div>
                        <span>D</span>
                    </div>
                </div>

                {/* Equation Input */}
                <div 
                    ref={displayRef} 
                    className="flex-1 text-right text-lg md:text-xl text-slate-900 break-all overflow-x-auto overflow-y-hidden items-center flex justify-end font-bold"
                    style={{ fontFamily: '"Times New Roman", serif' }}
                >
                    {/* KaTeX renders here */}
                    {!input && <span className="opacity-0">0</span>}
                </div>

                {/* Result Output */}
                <div 
                    ref={resultRef}
                    className="text-right text-2xl md:text-3xl font-bold text-slate-900 mt-1 h-10 overflow-hidden"
                >
                    {/* KaTeX renders here */}
                </div>
            </div>

            {/* KEYPAD AREA */}
            <div className="bg-slate-800 flex-1 p-3 md:p-5 overflow-y-auto">
                
                {/* MODE MENU OVERLAY */}
                {showModeMenu && (
                    <div className="absolute inset-0 top-20 bg-slate-900/95 z-50 p-4 grid grid-cols-2 gap-4 content-center animate-fade-in">
                        {['COMP', 'CMPLX', 'STAT', 'EQN', 'MATRIX', 'VECTOR'].map((m, i) => (
                            <button 
                                key={m}
                                onClick={() => handleModeSelect(m as CalculatorMode)}
                                className="bg-slate-700 text-white p-4 rounded-lg border border-slate-500 hover:bg-slate-600 text-left font-mono"
                            >
                                <span className="text-cyan-400 font-bold mr-2">{i+1}:</span>
                                {m}
                            </button>
                        ))}
                    </div>
                )}

                {/* ROW 1: Navigation & Control */}
                <div className="grid grid-cols-6 gap-2 mb-4 items-end">
                    <div className="col-span-1">
                        <SmallBtn label="SHIFT" color="bg-slate-600" onClick={() => setIsShift(!isShift)} shift="" alpha="" />
                    </div>
                    <div className="col-span-1">
                        <SmallBtn label="ALPHA" color="bg-slate-600" onClick={() => setIsAlpha(!isAlpha)} shift="" alpha="" />
                    </div>
                    
                    {/* Replay / D-Pad */}
                    <div className="col-span-2 flex items-center justify-center relative h-16">
                        <div className="absolute w-16 h-16 bg-slate-400 rounded-full shadow-lg border-2 border-slate-600 overflow-hidden">
                            <button className="absolute top-0 inset-x-0 h-1/3 flex justify-center items-start pt-1 hover:bg-slate-300 active:bg-slate-500"><ChevronUp size={14}/></button>
                            <button className="absolute bottom-0 inset-x-0 h-1/3 flex justify-center items-end pb-1 hover:bg-slate-300 active:bg-slate-500"><ChevronDown size={14}/></button>
                            <button className="absolute left-0 inset-y-0 w-1/3 flex items-center justify-start pl-1 hover:bg-slate-300 active:bg-slate-500"><ChevronLeft size={14}/></button>
                            <button className="absolute right-0 inset-y-0 w-1/3 flex items-center justify-end pr-1 hover:bg-slate-300 active:bg-slate-500"><ChevronRight size={14}/></button>
                            <div className="absolute inset-[30%] bg-slate-800 rounded-full pointer-events-none"></div>
                        </div>
                        <span className="absolute -top-3 text-[8px] text-slate-400 tracking-widest font-bold">REPLAY</span>
                    </div>

                    <div className="col-span-1">
                        <SmallBtn label="MODE" color="bg-slate-600" onClick={() => setShowModeMenu(!showModeMenu)} shift="SETUP" />
                    </div>
                    <div className="col-span-1">
                        <SmallBtn label="ON" color="bg-slate-600" onClick={handleClear} />
                    </div>
                </div>

                {/* ROW 2: Scientific Functions 1 */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                    <SmallBtn label="CALC" onClick={() => {}} shift="SOLVE" alpha="=" />
                    <SmallBtn label="∫dx" onClick={() => {}} shift="d/dx" alpha=":" />
                    <SmallBtn label="x⁻¹" onClick={() => handleKeyPress('^(-1)')} shift="x!" />
                    <SmallBtn label="log" onClick={() => handleKeyPress('log(')} shift="10^x" />
                    <SmallBtn label="ln" onClick={() => handleKeyPress('ln(')} shift="e^x" />
                    <SmallBtn label="x²" onClick={() => handleKeyPress('^2')} shift="√" />
                </div>

                {/* ROW 3: Scientific Functions 2 */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                    <SmallBtn label="x^a" onClick={() => handleKeyPress('^')} shift="ⁿ√" />
                    <SmallBtn label="√" onClick={() => handleKeyPress('sqrt(')} shift="³√" />
                    <SmallBtn label="hyp" onClick={() => {}} shift="Abs" />
                    <SmallBtn label="sin" onClick={() => handleKeyPress(isShift ? 'asin(' : 'sin(', 'func')} shift="sin⁻¹" alpha="D" />
                    <SmallBtn label="cos" onClick={() => handleKeyPress(isShift ? 'acos(' : 'cos(', 'func')} shift="cos⁻¹" alpha="E" />
                    <SmallBtn label="tan" onClick={() => handleKeyPress(isShift ? 'atan(' : 'tan(', 'func')} shift="tan⁻¹" alpha="F" />
                </div>

                {/* ROW 4: Scientific Functions 3 */}
                <div className="grid grid-cols-6 gap-2 mb-4">
                    <SmallBtn label="STO" onClick={() => {}} shift="RCL" />
                    <SmallBtn label="ENG" onClick={() => {}} shift="←" />
                    <SmallBtn label="(" onClick={() => handleKeyPress('(')} shift="" />
                    <SmallBtn label=")" onClick={() => handleKeyPress(')')} shift="," alpha="X" />
                    <SmallBtn label="S↔D" onClick={() => {}} shift="M+" alpha="Y" />
                    <SmallBtn label="M+" onClick={() => {}} shift="M-" alpha="M" />
                </div>

                {/* MAIN NUMPAD & OPERATIONS */}
                <div className="grid grid-cols-5 gap-3">
                    <MainBtn label="7" onClick={() => handleKeyPress('7')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="8" onClick={() => handleKeyPress('8')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="9" onClick={() => handleKeyPress('9')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="DEL" onClick={handleDelete} className="bg-orange-600 text-white text-base" />
                    <MainBtn label="AC" onClick={handleClear} className="bg-orange-600 text-white text-base" />

                    <MainBtn label="4" onClick={() => handleKeyPress('4')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="5" onClick={() => handleKeyPress('5')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="6" onClick={() => handleKeyPress('6')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="×" onClick={() => handleKeyPress('×', 'op')} className="bg-slate-300 text-black" />
                    <MainBtn label="÷" onClick={() => handleKeyPress('÷', 'op')} className="bg-slate-300 text-black" />

                    <MainBtn label="1" onClick={() => handleKeyPress('1')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="2" onClick={() => handleKeyPress('2')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="3" onClick={() => handleKeyPress('3')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="+" onClick={() => handleKeyPress('+', 'op')} className="bg-slate-300 text-black" />
                    <MainBtn label="-" onClick={() => handleKeyPress('-', 'op')} className="bg-slate-300 text-black" />

                    <MainBtn label="0" onClick={() => handleKeyPress('0')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="." onClick={() => handleKeyPress('.')} className="bg-gray-200 text-black font-bold" />
                    <MainBtn label="×10ˣ" onClick={() => handleKeyPress('*10^')} className="bg-gray-200 text-black text-sm font-bold" />
                    <MainBtn label="Ans" onClick={() => handleKeyPress('Ans', 'var')} className="bg-gray-200 text-black text-sm font-bold" />
                    <MainBtn label="=" onClick={handleCalculate} className="bg-slate-300 text-black font-bold text-xl" />
                </div>

            </div>
        </div>
    );
};