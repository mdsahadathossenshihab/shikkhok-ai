
import React from 'react';
import { GraduationCap, BookOpen, CalendarClock, MessageCircle, ArrowRight, CheckCircle2, Sparkles, BrainCircuit, Users } from 'lucide-react';

interface LandingScreenProps {
    onLogin: () => void;
    onSignup: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onLogin, onSignup }) => {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white relative z-10">
            
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="w-full px-6 py-5 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50 border-b border-white/5 bg-[#0f172a]/70">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight leading-none">Shikkhok AI</h1>
                        <p className="text-[10px] text-indigo-300 font-medium tracking-widest uppercase">Personal Tutor</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <button 
                        onClick={onLogin}
                        className="text-sm font-bold text-indigo-200 hover:text-white transition-colors px-2 md:px-4 py-2"
                    >
                        লগইন
                    </button>
                    <button 
                        onClick={onSignup}
                        className="bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <span>রেজিস্ট্রেশন</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <div className="flex-1 text-center md:text-left space-y-6 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold tracking-wide uppercase mb-2">
                        <Sparkles className="w-3 h-3" />
                        <span>বাংলাদেশের শিক্ষার্থীদের জন্য তৈরি</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        তোমার পড়াশোনার <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">স্মার্ট পার্টনার</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
                        শিক্ষক এআই (Shikkhok AI) হলো এমন একটি প্ল্যাটফর্ম যেখানে তুমি তোমার সিলেবাস অনুযায়ী যেকোনো বিষয়ে সাহায্য পাবে, কঠিন টপিক বুঝবে এবং নিজের রুটিন তৈরি করতে পারবে।
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                        <button 
                            onClick={onSignup}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.02]"
                        >
                            বিনামূল্যে শুরু করো
                        </button>
                        <button 
                            onClick={onLogin}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all backdrop-blur-md"
                        >
                            লগইন করুন
                        </button>
                    </div>

                    <div className="pt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ষষ্ঠ থেকে দ্বাদশ শ্রেণী
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> বাংলা মাধ্যম
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative w-full max-w-lg mx-auto md:max-w-none animate-slide-up" style={{animationDelay: '0.2s'}}>
                    {/* Abstract Visual Representation of App */}
                    <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl p-6 flex flex-col overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        
                        {/* Floating Cards Visuals */}
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 mb-4 w-3/4 self-end transform rotate-2 shadow-lg">
                             <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><MessageCircle className="w-4 h-4" /></div>
                                <div className="h-2 w-20 bg-white/20 rounded"></div>
                             </div>
                             <div className="space-y-2">
                                 <div className="h-2 w-full bg-white/10 rounded"></div>
                                 <div className="h-2 w-5/6 bg-white/10 rounded"></div>
                             </div>
                        </div>

                        <div className="bg-indigo-600/80 p-6 rounded-2xl border border-white/20 shadow-2xl z-10 transform -rotate-1">
                             <h3 className="font-bold text-lg mb-1">নিউটনের গতির সূত্র কী?</h3>
                             <p className="text-indigo-100 text-sm leading-relaxed">
                                নিউটনের প্রথম সূত্র অনুযায়ী, বাহ্যিক বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে...
                             </p>
                             <div className="mt-4 flex gap-2">
                                 <span className="h-6 w-16 bg-black/20 rounded-full"></span>
                                 <span className="h-6 w-12 bg-black/20 rounded-full"></span>
                             </div>
                        </div>

                        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 mt-4 w-2/3 self-start transform -rotate-2 shadow-lg">
                             <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><CalendarClock className="w-4 h-4" /></div>
                                <div>
                                    <div className="h-2 w-16 bg-white/20 rounded mb-1"></div>
                                    <div className="h-2 w-10 bg-white/10 rounded"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="bg-white/5 border-y border-white/5 backdrop-blur-lg py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">কেন শিক্ষক এআই ব্যবহার করবে?</h2>
                        <p className="text-gray-400 text-lg">
                            প্রাইভেট টিউটরের মতো করেই তোমাকে সাহায্য করবে আমাদের এই প্ল্যাটফর্ম।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">স্মার্ট এআই টিউটর</h3>
                            <p className="text-gray-400 leading-relaxed">
                                যেকোনো বিষয়ের কঠিন টপিক সহজ বাংলায় বুঝিয়ে দেবে। গণিত সমাধান থেকে শুরু করে বিজ্ঞানের জটিল থিওরি - সবকিছু মুহূর্তেই।
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <CalendarClock className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">রুটিন জেনারেটর</h3>
                            <p className="text-gray-400 leading-relaxed">
                                তোমার স্কুল, কোচিং এবং ঘুমের সময় অনুযায়ী স্বয়ংক্রিয়ভাবে পড়ার রুটিন তৈরি করে দেবে। পিডিএফ ডাউনলোড করার সুবিধাও আছে।
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-8 transition-all hover:-translate-y-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">শ্রেণীভিত্তিক সিলেবাস</h3>
                            <p className="text-gray-400 leading-relaxed">
                                ৬ষ্ঠ থেকে দ্বাদশ শ্রেণীর সকল গ্রুপ (বিজ্ঞান, মানবিক, ব্যবসায় শিক্ষা) এর বিষয়ভিত্তিক চ্যাপ্টার এবং প্রশ্ন ব্যাংক এখানে পাবে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">মাত্র ৩ ধাপে শুরু করো</h2>
                        
                        <div className="space-y-6">
                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">১</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">অ্যাকাউন্ট তৈরি করো</h4>
                                    <p className="text-gray-400">তোমার নাম এবং ইমেইল দিয়ে দ্রুত সাইন আপ করো।</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">২</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">প্রোফাইল সেটআপ</h4>
                                    <p className="text-gray-400">তোমার শ্রেণী এবং বিভাগ (Group) সিলেক্ট করো।</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">৩</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">পড়াশোনা শুরু</h4>
                                    <p className="text-gray-400">পছন্দের বিষয় বেছে নাও এবং এআই টিউটরের সাথে চ্যাট শুরু করো।</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-3xl p-8 border border-white/10">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white/5 p-4 rounded-xl text-center">
                                 <h3 className="text-3xl font-bold text-white mb-1">৫,০০০+</h3>
                                 <p className="text-xs text-gray-400 uppercase tracking-wider">শিক্ষার্থী</p>
                             </div>
                             <div className="bg-white/5 p-4 rounded-xl text-center">
                                 <h3 className="text-3xl font-bold text-white mb-1">২৪/৭</h3>
                                 <p className="text-xs text-gray-400 uppercase tracking-wider">সাপোর্ট</p>
                             </div>
                             <div className="bg-white/5 p-4 rounded-xl text-center col-span-2">
                                 <h3 className="text-3xl font-bold text-white mb-1">৫০+</h3>
                                 <p className="text-xs text-gray-400 uppercase tracking-wider">বিষয় ও অধ্যায়</p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 bg-[#0f172a]">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-gray-300">Shikkhok AI</span>
                    </div>
                    <div>
                        &copy; {new Date().getFullYear()} Shikkhok AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};
