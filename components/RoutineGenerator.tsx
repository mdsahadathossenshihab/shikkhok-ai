
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, RoutineActivity, Subject } from '../types';
import { generateStudentRoutine, RoutineInputs } from '../services/geminiService';
import { getSubjectsForUser } from '../constants';
import { CalendarClock, Moon, Sun, BookOpen, Briefcase, RefreshCw, Clock, CheckCircle2, Save, Target, GraduationCap, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface RoutineGeneratorProps {
    user: UserProfile;
}

export const RoutineGenerator: React.FC<RoutineGeneratorProps> = ({ user }) => {
    // Input States
    const [wakeTime, setWakeTime] = useState('06:00');
    const [sleepTime, setSleepTime] = useState('23:00');
    const [isSchoolOpen, setIsSchoolOpen] = useState(true);
    const [schoolStart, setSchoolStart] = useState('08:00');
    const [schoolEnd, setSchoolEnd] = useState('14:00');
    const [coaching, setCoaching] = useState('');
    const [routineGoal, setRoutineGoal] = useState('পরীক্ষার প্রস্তুতি (Exam Prep)');
    
    // Subjects Selection
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [selectedWeakSubjects, setSelectedWeakSubjects] = useState<string[]>([]);
    
    const [routine, setRoutine] = useState<RoutineActivity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Ref for the hidden print layout
    const printRef = useRef<HTMLDivElement>(null);

    // Load available subjects based on User Profile
    useEffect(() => {
        const { groupSubjects, commonSubjects } = getSubjectsForUser(user.classLevel, user.group);
        setAvailableSubjects([...groupSubjects, ...commonSubjects]);
    }, [user.classLevel, user.group]);

    // Load saved routine
    useEffect(() => {
        const savedRoutine = localStorage.getItem(`routine_${user.id}`);
        if (savedRoutine) {
            setRoutine(JSON.parse(savedRoutine));
        }
    }, [user.id]);

    const toggleSubject = (subjectName: string) => {
        setSelectedWeakSubjects(prev => 
            prev.includes(subjectName) 
                ? prev.filter(s => s !== subjectName)
                : [...prev, subjectName]
        );
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const inputs: RoutineInputs = {
                wakeTime,
                sleepTime,
                isSchoolOpen,
                schoolStart,
                schoolEnd,
                coaching,
                selectedSubjects: selectedWeakSubjects,
                routineGoal
            };

            const newRoutine = await generateStudentRoutine(user, inputs);
            setRoutine(newRoutine);
            localStorage.setItem(`routine_${user.id}`, JSON.stringify(newRoutine));
        } catch (error) {
            console.error("Failed to generate routine", error);
            alert("দুঃখিত, রুটিন তৈরি করা যাচ্ছে না। আবার চেষ্টা করুন।");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!printRef.current || routine.length === 0) return;
        setIsDownloading(true);
        
        try {
            const element = printRef.current;
            
            // Wait for element to be potentially rendered (though it's fixed)
            // Use specific width for PDF consistency
            const canvas = await html2canvas(element, {
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff',
                width: 800, // Match container width
                windowWidth: 800,
                // CRITICAL: Set height to full scrollHeight to avoid cutoff
                height: element.scrollHeight,
                windowHeight: element.scrollHeight,
                scrollY: 0,
                x: 0,
                y: 0
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            // A4 Size
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Calculate height ratio
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;
            
            let heightLeft = imgHeight;
            let position = 0;
            
            // Add first page
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            
            // Add subsequent pages if needed
            while (heightLeft > 0) {
                position -= pdfHeight; // Shift image up by one page height
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save(`${user.name}_Routine.pdf`);
        } catch (e) {
            console.error("PDF Download Error", e);
            alert("পিডিএফ ডাউনলোড করা যাচ্ছে না।");
        } finally {
            setIsDownloading(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch(type) {
            case 'school': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'study': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'break': return 'bg-orange-50 text-orange-800 border-orange-200';
            case 'prayer': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'sleep': return 'bg-slate-800 text-slate-100 border-slate-700';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-gray-50 text-slate-900 overflow-hidden relative">
            
            {/* --- HIDDEN PRINT LAYOUT (A4 SIDEBAR DESIGN) --- */}
            {/* Uses 'top-0 left-0' but 'fixed' to be outside flow, yet renderable by html2canvas */}
            <div className="fixed top-0 left-0 -z-50 overflow-hidden w-0 h-0">
                <div ref={printRef} className="w-[800px] min-h-0 flex flex-row bg-white font-sans relative">
                    {/* LEFT SIDEBAR FOR PDF */}
                    <div className="w-[260px] bg-[#1e293b] text-white p-8 flex flex-col shrink-0 min-h-[1123px]">
                        <div className="space-y-10 flex-1">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        <GraduationCap className="w-8 h-8 text-indigo-300" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-xl leading-tight">Shikkhok AI</h2>
                                        <p className="text-xs text-indigo-300">Personal Tutor</p>
                                    </div>
                                </div>
                                <div className="h-px bg-white/10 w-full"></div>
                            </div>

                            {/* Student Info */}
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Student Name</p>
                                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                </div>
                                
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Class & Group</p>
                                    <p className="text-base text-gray-200">{user.classLevel}</p>
                                    <p className="text-sm text-gray-400">{user.group}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Target / Goal</p>
                                    <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-lg">
                                        <p className="text-sm text-indigo-100 leading-relaxed">{routineGoal}</p>
                                    </div>
                                </div>

                                {selectedWeakSubjects.length > 0 && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-2">Focus Subjects</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedWeakSubjects.map(sub => (
                                                <span key={sub} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 border border-white/5">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="space-y-4 mt-auto pt-10">
                            <div className="bg-indigo-600/20 p-4 rounded-xl border border-indigo-500/20">
                                <p className="text-xs text-indigo-200 mb-1">Total Activities</p>
                                <p className="text-2xl font-bold text-white">{routine.length}</p>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[10px] text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT FOR PDF */}
                    <div className="flex-1 bg-slate-50 p-8">
                        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Daily Routine</h1>
                                <p className="text-slate-500 text-sm mt-1">Your personalized schedule for success</p>
                            </div>
                            <div className="text-right">
                                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {new Date().toLocaleDateString('bn-BD', { weekday: 'long' })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {routine.map((item, idx) => (
                                <div key={idx} className="flex group">
                                    {/* Time Column */}
                                    <div className="w-32 shrink-0 pt-3 relative">
                                        <div className="text-sm font-bold text-slate-700">{item.time.split('-')[0]}</div>
                                        <div className="text-xs text-slate-400">{item.time.split('-')[1]}</div>
                                        {/* Timeline dot */}
                                        <div className={`absolute right-0 top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10
                                            ${item.type === 'study' ? 'bg-indigo-500' : 
                                              item.type === 'school' ? 'bg-blue-500' :
                                              item.type === 'prayer' ? 'bg-emerald-500' :
                                              item.type === 'break' ? 'bg-orange-400' : 'bg-slate-600'}
                                        `}></div>
                                        {/* Vertical Line */}
                                        {idx !== routine.length - 1 && (
                                            <div className="absolute right-[5px] top-7 bottom-[-8px] w-0.5 bg-slate-200"></div>
                                        )}
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 ml-6 p-3 rounded-xl border-l-4 shadow-sm ${
                                        item.type === 'study' ? 'bg-white border-indigo-500' : 
                                        item.type === 'school' ? 'bg-blue-50 border-blue-500' :
                                        item.type === 'prayer' ? 'bg-emerald-50 border-emerald-500' :
                                        item.type === 'break' ? 'bg-orange-50 border-orange-400' : 
                                        'bg-slate-800 text-white border-slate-600'
                                    }`}>
                                        <div className="flex justify-between items-start">
                                            <h4 className={`font-bold text-sm md:text-base mb-1 ${item.type === 'sleep' ? 'text-white' : 'text-slate-800'}`}>
                                                {item.activity}
                                            </h4>
                                            <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                                                item.type === 'study' ? 'bg-indigo-100 text-indigo-700' : 
                                                item.type === 'sleep' ? 'bg-slate-700 text-slate-300' :
                                                'bg-white/50 text-slate-500'
                                            }`}>
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* LEFT PANEL: Controls (Visible in App) */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto z-10 shadow-xl">
                <div className="p-6 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                            <CalendarClock className="w-6 h-6" />
                            রুটিন সেটআপ
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">তোমার সারা দিনের তথ্য দাও</p>
                    </div>

                    {/* Time Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4" /> সময়সূচী
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">ঘুম থেকে ওঠা</label>
                                <div className="relative">
                                    <Sun className="w-4 h-4 text-orange-500 absolute left-3 top-2.5" />
                                    <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} 
                                        className="w-full pl-9 p-2 bg-orange-50 border border-orange-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">ঘুমানোর সময়</label>
                                <div className="relative">
                                    <Moon className="w-4 h-4 text-indigo-500 absolute left-3 top-2.5" />
                                    <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} 
                                        className="w-full pl-9 p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* School Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> স্কুল/কলেজ
                            </h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isSchoolOpen} onChange={e => setIsSchoolOpen(e.target.checked)} className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        {isSchoolOpen && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">শুরু</label>
                                    <input type="time" value={schoolStart} onChange={e => setSchoolStart(e.target.value)} 
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">শেষ</label>
                                    <input type="time" value={schoolEnd} onChange={e => setSchoolEnd(e.target.value)} 
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subjects */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> কঠিন বিষয়সমূহ
                        </h3>
                        <p className="text-xs text-gray-500">যে বিষয়গুলোতে বেশি সময় দিতে চাও তা সিলেক্ট করো</p>
                        <div className="flex flex-wrap gap-2">
                            {availableSubjects.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => toggleSubject(sub.name)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                        selectedWeakSubjects.includes(sub.name)
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                    }`}
                                >
                                    {sub.name}
                                    {selectedWeakSubjects.includes(sub.name) && <CheckCircle2 className="w-3 h-3 inline ml-1" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="space-y-2">
                         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Target className="w-4 h-4" /> লক্ষ্য (Goal)
                        </h3>
                        <input 
                            type="text" 
                            value={routineGoal}
                            onChange={(e) => setRoutineGoal(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="যেমন: গণিত শেষ করা..."
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full py-4 bg-indigo-900 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        নতুন রুটিন তৈরি করুন
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: Output (Visible in App) */}
            <div className="flex-1 bg-gray-50/50 overflow-y-auto relative">
                {routine.length > 0 ? (
                    <div className="p-6 max-w-3xl mx-auto pb-24">
                        <div className="flex justify-between items-center mb-8">
                             <div>
                                <h2 className="text-2xl font-bold text-gray-800">আজকের রুটিন</h2>
                                <p className="text-gray-500 text-sm">Shikkhok AI দ্বারা তৈরি</p>
                             </div>
                             <button 
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-indigo-600 font-medium transition-colors"
                             >
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                PDF ডাউনলোড
                             </button>
                        </div>

                        <div className="space-y-4 relative">
                             {/* Timeline Line */}
                             <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 hidden md:block"></div>

                             {routine.map((item, idx) => (
                                 <div key={idx} className="relative md:pl-12 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                     {/* Timeline Dot */}
                                     <div className={`absolute left-[11px] top-6 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 hidden md:block
                                        ${item.type === 'study' ? 'bg-indigo-500' : 
                                          item.type === 'school' ? 'bg-blue-500' :
                                          item.type === 'prayer' ? 'bg-emerald-500' :
                                          item.type === 'break' ? 'bg-orange-400' : 'bg-gray-400'}
                                     `}></div>

                                     <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${getTypeColor(item.type)}`}>
                                         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                             <div className="flex items-center gap-3">
                                                 <div className={`p-2 rounded-lg bg-white/50 backdrop-blur-sm`}>
                                                     {item.type === 'study' ? <BookOpen className="w-5 h-5" /> :
                                                      item.type === 'school' ? <Briefcase className="w-5 h-5" /> :
                                                      item.type === 'sleep' ? <Moon className="w-5 h-5" /> :
                                                      <Clock className="w-5 h-5" />}
                                                 </div>
                                                 <div>
                                                     <h4 className="font-bold text-lg leading-snug">{item.activity}</h4>
                                                     <span className="text-xs opacity-80 uppercase font-semibold tracking-wider">{item.time}</span>
                                                 </div>
                                             </div>
                                             <span className="text-[10px] uppercase font-bold px-2 py-1 bg-white/30 rounded self-start md:self-center">
                                                 {item.type}
                                             </span>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <CalendarClock className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">কোনো রুটিন তৈরি করা হয়নি</h3>
                        <p className="max-w-xs mx-auto">বাম পাশের প্যানেল থেকে তোমার সময় এবং বিষয়গুলো ঠিক করে "নতুন রুটিন তৈরি করুন" বাটনে চাপ দাও।</p>
                    </div>
                )}
            </div>
        </div>
    );
};
