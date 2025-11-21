
import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import { loginUser, registerUser } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile, isNewUser: boolean) => void;
  onBack: () => void;
  initialView?: 'login' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onBack, initialView = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialView === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        if (isLogin) {
            const user = await loginUser(email, password);
            onAuthSuccess(user, false); // Existing user
        } else {
            if (!name) throw new Error("দয়া করে আপনার নাম লিখুন");
            const user = await registerUser(name, email, password);
            onAuthSuccess(user, true); // New user
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("Auth Error:", err);
        
        // Handle specific Firebase errors
        if (err.code === 'permission-denied') {
            setError("ডাটাবেস পারমিশন নেই। দয়া করে Firebase Console-এ Rules চেক করুন।");
        } else if (err.code === 'auth/email-already-in-use') {
            setError("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।");
        } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
        } else if (err.code === 'auth/weak-password') {
            setError("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
        } else {
            setError(err.message || "কোথাও সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-all font-medium z-20"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>ফিরে যান</span>
      </button>

      <div className="glass-panel p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/40 animate-fade-in relative">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
            <div className="bg-white/50 w-20 h-20 rounded-full flex items-center justify-center shadow-inner mb-4">
                <GraduationCap className="w-10 h-10 text-indigo-700" />
            </div>
            <h1 className="text-3xl font-bold text-indigo-950">শিক্ষক এআই</h1>
            <p className="text-indigo-800 text-sm mt-1">তোমার ব্যক্তিগত এআই টিউটর</p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-indigo-900/10 p-1 rounded-xl mb-6">
            <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    isLogin ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-800 hover:bg-white/30'
                }`}
            >
                লগইন
            </button>
            <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    !isLogin ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-800 hover:bg-white/30'
                }`}
            >
                সাইন আপ
            </button>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <div className="space-y-1">
                    <label className="text-xs font-bold text-indigo-900 ml-1">আপনার নাম</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400" />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 placeholder-indigo-400/70"
                            placeholder="আপনার পুরো নাম"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-900 ml-1">ইমেইল</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400" />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 placeholder-indigo-400/70"
                        placeholder="example@email.com"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-900 ml-1">পাসওয়ার্ড</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400" />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 placeholder-indigo-400/70"
                        placeholder="******"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-indigo-500/30 transform hover:scale-[1.02] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        {isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট খুলুন'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};
