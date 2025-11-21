import React, { useState } from 'react';
import { UserProfile, ClassLevel } from '../types';
import { CLASS_OPTIONS } from '../constants';
import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { saveUserProfileToDB } from '../services/firebase';

interface WelcomeScreenProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, setUser, onNext }) => {
  const [isSaving, setIsSaving] = useState(false);
  const canProceed = user.name.trim().length > 0 && user.classLevel;

  const handleNext = async () => {
    if (!canProceed) return;
    
    setIsSaving(true);
    try {
        await saveUserProfileToDB(user);
        onNext();
    } catch (error) {
        console.error("Failed to save profile", error);
        alert("প্রোফাইল সেভ করা যাচ্ছে না।");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10">
      <div className="glass-panel p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/40 animate-fade-in">
        <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <GraduationCap className="w-8 h-8 text-indigo-700" />
        </div>
        
        <h1 className="text-3xl font-bold text-indigo-950 mb-2">প্রোফাইল সেটআপ</h1>
        <p className="text-indigo-800 mb-8">তোমার সম্পর্কে তথ্য আপডেট করো</p>

        <div className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-semibold text-indigo-900 mb-2 ml-1">
              তোমার নাম
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="তোমার নাম লিখ..."
              className="w-full p-4 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 placeholder-indigo-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-900 mb-2 ml-1">
              তোমার শ্রেণী
            </label>
            <select
              value={user.classLevel}
              onChange={(e) => setUser({ ...user, classLevel: e.target.value as ClassLevel })}
              className="w-full p-4 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 bg-white/50 cursor-pointer appearance-none"
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed || isSaving}
            className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-lg transition-all transform shadow-lg ${
              canProceed && !isSaving
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-indigo-500/30'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <>
                    <span>সেভ করে এগিয়ে যান</span>
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};