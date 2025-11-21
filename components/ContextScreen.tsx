
import React, { useState, useEffect } from 'react';
import { UserProfile, ClassLevel, GroupType, Subject } from '../types';
import { GROUP_OPTIONS, getSubjectsForUser } from '../constants';
import { saveUserProfileToDB, logoutUser } from '../services/firebase';
import * as Icons from 'lucide-react';

interface ContextScreenProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onStart: () => void;
  onBack: () => void;
}

export const ContextScreen: React.FC<ContextScreenProps> = ({ user, setUser, onStart, onBack }) => {
  // Determine if group selection is needed
  const needsGroup = [
    ClassLevel.CLASS_9, 
    ClassLevel.CLASS_10, 
    ClassLevel.CLASS_11, 
    ClassLevel.CLASS_12
  ].includes(user.classLevel);

  const [subjects, setSubjects] = useState<{ groupSubjects: Subject[], commonSubjects: Subject[] }>({ groupSubjects: [], commonSubjects: [] });
  const [selectedSubjectForChapters, setSelectedSubjectForChapters] = useState<Subject | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    setSubjects(getSubjectsForUser(user.classLevel, user.group));
  }, [user.classLevel, user.group]);

  // Save group selection to DB when it changes
  const handleGroupChange = (newGroup: GroupType) => {
      const updatedUser = { ...user, group: newGroup, subject: undefined, chapter: undefined };
      setUser(updatedUser);
      saveUserProfileToDB(updatedUser);
  };

  const handleSubjectClick = (sub: Subject) => {
    setSelectedSubjectForChapters(sub);
  };

  const handleChapterSelect = (chapter: string) => {
    if (selectedSubjectForChapters) {
      setUser({ ...user, subject: selectedSubjectForChapters, chapter: chapter });
      onStart();
    }
  };

  const closeChapterModal = () => {
    setSelectedSubjectForChapters(null);
  };

  const handleLogout = async () => {
    if(window.confirm("আপনি কি নিশ্চিত যে আপনি লগ আউট করতে চান?")) {
        await logoutUser();
    }
  };

  // Dynamic Icon Component
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const LucideIcon = (Icons as any)[name];
    return LucideIcon ? <LucideIcon className={className} /> : <Icons.Book className={className} />;
  };

  // Subject Grid Component
  const SubjectGrid = ({ items }: { items: Subject[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((sub) => (
        <button
          key={sub.id}
          onClick={() => handleSubjectClick(sub)}
          className={`relative group p-6 rounded-2xl transition-all duration-300 text-left overflow-hidden
            hover:transform hover:scale-[1.02] hover:shadow-xl
            bg-white/90 backdrop-blur-md border border-white/50 shadow-sm
          `}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${sub.color}`} />
          
          <div className={`w-12 h-12 rounded-xl ${sub.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
            <IconComponent name={sub.icon} className="w-6 h-6" />
          </div>
          
          <h4 className="text-gray-800 font-bold text-xl mb-1">{sub.name}</h4>
          <p className="text-gray-500 text-xs">{sub.chapters.length} টি অধ্যায়</p>
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-full flex flex-col p-4 md:p-8 max-w-6xl mx-auto z-10 relative">
      
      {/* Header Section - Simplified & Clean */}
      <div className="flex justify-end items-center mb-8">
          <button 
            onClick={() => setShowProfileModal(true)}
            className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-1.5 pr-4 rounded-full transition-all shadow-lg"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-inner ring-2 ring-white/10 group-hover:scale-105 transition-transform">
                <Icons.User className="w-5 h-5" />
            </div>
            <div className="text-left">
                <span className="block text-xs text-indigo-200 font-semibold uppercase tracking-wider">Account</span>
            </div>
            <Icons.ChevronDown className="w-4 h-4 text-indigo-300 ml-1" />
          </button>
      </div>

      <div className="text-center mb-10 text-white animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">পড়ার বিষয় ঠিক করি</h2>
        <p className="opacity-90 text-lg font-medium bg-black/20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
            স্বাগতম, {user.name}! তুমি {user.classLevel}-এ পড়ছো।
        </p>
      </div>

      {needsGroup && (
        <div className="mb-12 animate-slide-up">
          <h3 className="text-white/90 font-bold mb-4 text-lg flex items-center gap-2">
            <Icons.Users className="w-5 h-5" />
            তোমার বিভাগ (Group) নির্বাচন করো
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GROUP_OPTIONS.map((group) => (
              <button
                key={group.value}
                onClick={() => handleGroupChange(group.value)}
                className={`p-5 rounded-2xl border transition-all flex items-center justify-center text-lg font-bold shadow-sm
                  ${user.group === group.value 
                    ? 'bg-white text-indigo-700 border-white shadow-xl scale-[1.02] ring-4 ring-white/20' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm'
                  }`}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-12 pb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Group Subjects Section */}
        {subjects.groupSubjects.length > 0 && (
          <div>
            <h3 className="text-white font-bold mb-6 text-xl flex items-center gap-3 border-b border-white/20 pb-2">
              {needsGroup && user.group !== GroupType.NONE ? (
                 <>
                    <Icons.Layers className="w-6 h-6 text-indigo-200" />
                    বিভাগ ভিত্তিক বিষয়
                 </>
              ) : (
                 <>
                    <Icons.Book className="w-6 h-6 text-indigo-200" />
                    বিষয়সমূহ
                 </>
              )}
            </h3>
            
            {needsGroup && user.group === GroupType.NONE ? (
               <div className="text-white/70 text-center py-12 border-2 border-dashed border-white/20 rounded-3xl bg-black/5 backdrop-blur-sm">
                  <Icons.ArrowUpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">প্রথমে উপরের তালিকা থেকে তোমার বিভাগ নির্বাচন করো</p>
               </div>
            ) : (
               <SubjectGrid items={subjects.groupSubjects} />
            )}
          </div>
        )}

        {/* Common Subjects Section (Only for classes with groups) */}
        {subjects.commonSubjects.length > 0 && needsGroup && user.group !== GroupType.NONE && (
          <div>
             <div className="flex items-center mb-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-3 border-b border-white/20 pb-2 w-full">
                    <Icons.BookOpen className="w-6 h-6 text-indigo-200" />
                    আবশ্যিক বিষয়
                </h3>
             </div>
             <SubjectGrid items={subjects.commonSubjects} />
          </div>
        )}
      </div>

      {/* Chapter Selection Modal */}
      {selectedSubjectForChapters && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeChapterModal}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10 animate-scale-in">
                <div className={`p-6 ${selectedSubjectForChapters.color} text-white flex justify-between items-center shrink-0`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl shadow-inner">
                             <IconComponent name={selectedSubjectForChapters.icon} className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold leading-tight">{selectedSubjectForChapters.name}</h3>
                            <p className="text-white/90 text-sm font-medium opacity-90">অধ্যায় নির্বাচন করুন</p>
                        </div>
                    </div>
                    <button onClick={closeChapterModal} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <Icons.X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50">
                    {selectedSubjectForChapters.chapters.map((chapter, index) => (
                        <button
                            key={index}
                            onClick={() => handleChapterSelect(chapter)}
                            className="text-left p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 group-hover:bg-indigo-50 transition-colors"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 block tracking-wider">অধ্যায় {index + 1}</span>
                            <div className="flex justify-between items-center gap-2">
                                <span className="font-bold text-gray-700 group-hover:text-indigo-700 leading-tight">{chapter}</span>
                                <Icons.ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 shrink-0" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 animate-scale-in overflow-hidden">
                <div className="bg-indigo-600 p-6 text-center relative">
                    <button 
                        onClick={() => setShowProfileModal(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1"
                    >
                        <Icons.X className="w-6 h-6" />
                    </button>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ring-4 ring-indigo-500 ring-opacity-50">
                        <Icons.User className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                    <p className="text-indigo-200 text-sm font-medium">{user.email}</p>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center text-gray-600">
                            <Icons.GraduationCap className="w-5 h-5 mr-3 text-indigo-500" />
                            <span className="font-medium">শ্রেণী</span>
                        </div>
                        <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm">{user.classLevel}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center text-gray-600">
                            <Icons.Layers className="w-5 h-5 mr-3 text-indigo-500" />
                            <span className="font-medium">বিভাগ</span>
                        </div>
                        <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm">{user.group}</span>
                    </div>

                    <div className="pt-2 space-y-3">
                        <button 
                            onClick={onBack}
                            className="w-full py-3.5 rounded-xl border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center"
                        >
                            <Icons.Edit className="w-4 h-4 mr-2" />
                            তথ্য পরিবর্তন করুন
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="w-full py-3.5 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                            <Icons.LogOut className="w-4 h-4 mr-2" />
                            লগ আউট
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
