import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { createTutorChat, sendMessageStream } from '../services/geminiService';
import { saveChatHistory, getChatHistory, clearChatHistory } from '../services/firebase';
import { Chat, GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as Icons from 'lucide-react';

interface ChatScreenProps {
  user: UserProfile;
  onExit: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ user, onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const shouldAutoScrollRef = useRef(true);

  // Initialize Chat Session & Load History
  useEffect(() => {
    const initChat = async () => {
        if (!user.subject || !user.chapter) return;

        // Use user.id for better permission handling in Firestore
        const savedMessages = await getChatHistory(user.id, user.subject.id, user.chapter);
        
        let initialMessages = savedMessages;
        
        if (!initialMessages || initialMessages.length === 0) {
            initialMessages = [{
                id: 'intro',
                role: 'model',
                text: `হাই **${user.name}**! আজ আমরা **${user.subject?.name}** বিষয়ের **"${user.chapter}"** অধ্যায় নিয়ে আলোচনা করবো। \n\nতোমার কি কোনো নির্দিষ্ট প্রশ্ন আছে? তুমি চাইলে খাতায় লেখা কোনো সমস্যার ছবিও আমাকে পাঠাতে পারো!`,
            }];
        }

        setMessages(initialMessages);
        const chat = createTutorChat(user, initialMessages);
        setChatSession(chat);
        setIsInitializing(false);
    };

    initChat();
  }, [user.id, user.subject?.id, user.chapter, user.name]);

  // Save messages to local storage/DB whenever they change
  useEffect(() => {
      if (messages.length > 0 && user.subject && user.chapter && !isInitializing) {
          // Use user.id
          saveChatHistory(user.id, user.subject.id, user.chapter, messages);
      }
  }, [messages, user.id, user.subject?.id, user.chapter, isInitializing]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    shouldAutoScrollRef.current = isNearBottom;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = (smooth = true) => {
    shouldAutoScrollRef.current = true;
    setShowScrollButton(false);
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (shouldAutoScrollRef.current && !isInitializing) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isInitializing]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const clearImage = () => {
      setSelectedImage(null);
  };

  const handleClearHistory = async () => {
      if(window.confirm('তুমি কি এই অধ্যায়ের সব চ্যাট মুছে ফেলতে চাও?')) {
          if (user.subject && user.chapter) {
            // Use user.id
            await clearChatHistory(user.id, user.subject.id, user.chapter);
            const introMsg: ChatMessage = {
                id: 'intro',
                role: 'model',
                text: `হাই **${user.name}**! চ্যাট ক্লিয়ার করা হয়েছে। আবার নতুন করে প্রশ্ন করো।`,
            };
            setMessages([introMsg]);
            const chat = createTutorChat(user, [introMsg]);
            setChatSession(chat);
          }
      }
  };

  const handleSend = async (text: string) => {
    if ((!text.trim() && !selectedImage) || !chatSession || isLoading) return;

    const userMsgId = Date.now().toString();
    
    const newUserMsg: ChatMessage = { 
        id: userMsgId, 
        role: 'user', 
        text: text,
        image: selectedImage || undefined
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    
    shouldAutoScrollRef.current = true;
    setTimeout(() => scrollToBottom(), 100);

    const imageToSend = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    const initialModelMsg: ChatMessage = { id: modelMsgId, role: 'model', text: '' };
    setMessages(prev => [...prev, initialModelMsg]);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let apiMessage: any = text;

      if (imageToSend) {
        const base64Data = imageToSend.split(',')[1];
        const mimeType = imageToSend.split(';')[0].split(':')[1];
        
        apiMessage = [
            { text: text || "এই ছবিটি দেখুন এবং ব্যাখ্যা করুন।" },
            { 
                inlineData: { 
                    mimeType: mimeType, 
                    data: base64Data 
                } 
            }
        ];
      }

      const streamResult = await sendMessageStream(chatSession, apiMessage);
      
      let accumulatedText = '';
      
      for await (const chunk of streamResult) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          accumulatedText += chunkText;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMsgId ? { ...msg, text: accumulatedText } : msg
            )
          );
        }
      }
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, text: 'দুঃখিত, আমি সংযোগ করতে পারছি না। কিছুক্ষণ পর আবার চেষ্টা করো।', isError: true } 
            : msg
        )
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Icon helper
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const LucideIcon = (Icons as any)[name];
    return LucideIcon ? <LucideIcon className={className} /> : <Icons.Book className={className} />;
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-5xl mx-auto bg-white/10 md:backdrop-blur-3xl md:my-4 md:rounded-3xl md:h-[calc(100vh-2rem)] overflow-hidden shadow-2xl border border-white/20 relative z-10">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 p-3 flex items-center justify-between z-20 shadow-sm relative">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className={`p-2 rounded-lg ${user.subject?.color || 'bg-indigo-600'} text-white shadow-md shrink-0`}>
            <IconComponent name={user.subject?.icon || 'Book'} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-indigo-950 text-lg leading-tight truncate">
              {user.subject?.name}
            </h2>
            <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-1">
              <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px]">{user.chapter}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={handleClearHistory}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 shrink-0"
                title="চ্যাট ক্লিয়ার করুন"
            >
                <Icons.Trash2 className="w-5 h-5" />
            </button>
            <button 
                onClick={onExit}
                className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-indigo-50 shrink-0"
                title="বন্ধ করুন"
            >
                <Icons.X className="w-6 h-6" />
            </button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-white/40 scrollbar-hide relative"
      >
        {isInitializing ? (
            <div className="flex items-center justify-center h-full">
                <Icons.Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        ) : (
            <>
                {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                    className={`
                        max-w-[90%] md:max-w-[80%] rounded-2xl p-4 shadow-sm text-sm md:text-base
                        ${msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : `bg-white border border-white/50 text-gray-800 rounded-tl-none ${msg.isError ? 'border-red-300 bg-red-50' : ''}`
                        }
                    `}
                    >
                    {msg.image && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-white/20 bg-black/5">
                            <img src={msg.image} alt="Uploaded content" className="max-w-full h-auto" />
                        </div>
                    )}
                    
                    {msg.role === 'model' ? (
                        <div className="markdown-content">
                        <ReactMarkdown 
                            remarkPlugins={[remarkMath]} 
                            rehypePlugins={[rehypeKatex]}
                        >
                            {msg.text}
                        </ReactMarkdown>
                        {msg.text === '' && (
                            <div className="flex space-x-1 h-6 items-center p-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        )}
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef} className="h-1" />
            </>
        )}
      </div>

      {/* Floating Scroll Button */}
      {showScrollButton && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <button 
            onClick={() => scrollToBottom(true)}
            className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 transition-all transform hover:scale-105 animate-bounce"
          >
            <Icons.ArrowDown className="w-4 h-4" />
            নতুন মেসেজ দেখুন
          </button>
        </div>
      )}

      {/* Suggestion Chips */}
      {!isLoading && !isInitializing && messages[messages.length - 1]?.role === 'model' && (
        <div className="px-4 pt-2 pb-0 bg-white/60 backdrop-blur-sm overflow-x-auto flex space-x-2 scrollbar-hide border-t border-indigo-50">
            {user.subject?.prompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-xs md:text-sm font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm mb-2"
              >
                {prompt}
              </button>
            ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-lg border-t border-indigo-100 z-20">
        {selectedImage && (
            <div className="mb-3 relative inline-block animate-fade-in">
                <div className="relative rounded-xl overflow-hidden border border-indigo-200 shadow-md group">
                    <img src={selectedImage} alt="Preview" className="h-20 w-auto object-cover" />
                    <button 
                        onClick={clearImage}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                    >
                        <Icons.X className="w-3 h-3" />
                    </button>
                </div>
            </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          className="flex items-center gap-2 relative"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm"
            title="ছবি যোগ করুন"
          >
            <Icons.Camera className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={selectedImage ? "ছবিটি সম্পর্কে কিছু বলুন..." : "প্রশ্ন লিখুন..."}
            className="flex-1 p-4 pr-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner"
            disabled={isLoading || isInitializing}
          />
          <button
            type="submit"
            disabled={isLoading || isInitializing || (!inputValue.trim() && !selectedImage)}
            className={`p-3 rounded-xl transition-all flex-shrink-0
              ${isLoading || isInitializing || (!inputValue.trim() && !selectedImage)
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105'
              }
            `}
          >
            {isLoading ? <Icons.Loader2 className="w-5 h-5 animate-spin" /> : <Icons.Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};