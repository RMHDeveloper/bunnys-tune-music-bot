
import React, { useState, useEffect, useRef } from 'react';
import { QUESTIONS, LOCALIZED_CONTENT, THEME_BEIGE, THEME_BROWN } from './constants';
import { UserAnswers, RecommendedSong } from './types';
import { Button } from './components/Button';
import { ChatBubble } from './components/ChatBubble';
import { getMusicRecommendations } from './services/geminiService';

const LOGO_URL = "https://rabbitmarketinghouse.in/webinar/assets/ChatGPT_Image_Jan_3__2026__06_03_47_PM-removebg-preview%202.png";

type ViewState = 'splash' | 'start' | 'quiz' | 'loading' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('splash');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserAnswers>>({});
  const [recommendations, setRecommendations] = useState<RecommendedSong[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep, view, isLoading]);

  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => {
        setView('start');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const getQuestionText = (step: number) => {
    const q = QUESTIONS[step];
    const lang = answers.language;
    if (step === 0 || !lang || !LOCALIZED_CONTENT[lang]) return q.text;
    const loc = LOCALIZED_CONTENT[lang];
    const prefix = (step === 1 && loc.prefix) ? loc.prefix + " " : "";
    switch (q.id) {
      case 'mood': return prefix + (loc.mood || q.text);
      case 'directChoice': return loc.directChoice || q.text;
      case 'occasion': return loc.occasion || q.text;
      case 'instrument': return loc.instrument || q.text;
      default: return q.text;
    }
  };

  const handleOptionSelect = async (option: string) => {
    const currentQuestion = QUESTIONS[currentStep];
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);
    if (currentStep === 0) {
      setView('quiz');
      setCurrentStep(1);
    } else if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setView('loading');
      setError(null);
      try {
        const result = await getMusicRecommendations(newAnswers as UserAnswers);
        setRecommendations(result.songs);
        setView('results');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load music suggestions.");
        setView('quiz');
      }
    }
  };

  const handleBack = () => {
    if (view === 'results') {
      setView('quiz');
      setCurrentStep(QUESTIONS.length - 1);
    } else if (view === 'quiz') {
      if (currentStep === 1) {
        setView('start');
        setCurrentStep(0);
        setAnswers({});
      } else {
        const prevStep = currentStep - 1;
        const prevId = QUESTIONS[prevStep].id;
        const newAnswers = { ...answers };
        delete newAnswers[prevId as keyof UserAnswers];
        setAnswers(newAnswers);
        setCurrentStep(prevStep);
      }
    } else if (view === 'start') {
      setView('splash');
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations(null);
    setError(null);
    setView('splash');
  };

  const getYoutubeLink = (song: RecommendedSong) => {
    const query = encodeURIComponent(`${song.name} ${song.artist} ${song.language} official song`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#f3e5d8] z-40 flex items-center justify-between px-6 border-b border-[#4e342e]/10 shadow-sm">
      <div className="flex items-center gap-2">
        <img src={LOGO_URL} alt="Logo" className="w-8 h-8 object-contain" />
        <h1 className="font-decorative text-xl text-[#4e342e]">Bunny's Tune</h1>
      </div>
      <button 
        onClick={handleBack}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4e342e]/5 text-[#4e342e] active:scale-90 transition-transform hover:bg-[#4e342e]/10"
        aria-label="Go back"
      >
        <i className="fa-solid fa-chevron-left text-base"></i>
      </button>
    </div>
  );

  const renderSplash = () => (
    <div className="fixed inset-0 z-50 bg-[#f3e5d8] flex flex-col items-center justify-center animate-fade-in overflow-hidden cursor-pointer" onClick={() => setView('start')}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute inset-0 border border-[#4e342e] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: `${10 + (i * 15)}%`, height: `${10 + (i * 15)}%` }}></div>
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-64 h-64 bg-[#4e342e] rounded-full flex flex-col items-center justify-center shadow-2xl border-8 border-white/10 overflow-hidden">
          <div className="bg-[#f3e5d8] p-4 rounded-full mb-3 shadow-inner">
            <img src={LOGO_URL} alt="Bunny's Tune Logo" className="w-32 h-32 object-contain transform -rotate-6" />
          </div>
          <div className="flex gap-2 h-12 items-end mb-2">
            <div className="w-2 h-8 bg-[#FF8C00] rounded-full animate-bounce-slow"></div>
            <div className="w-2 h-12 bg-[#FF8C00] rounded-full animate-bounce-normal"></div>
            <div className="w-2 h-6 bg-[#FF8C00] rounded-full animate-bounce-fast"></div>
            <div className="w-2 h-10 bg-[#FF8C00] rounded-full animate-bounce-normal"></div>
          </div>
        </div>
        <h1 className="mt-12 text-4xl font-black text-[#4e342e] tracking-tighter uppercase text-center px-4">Bunny's Tune Music</h1>
        <p className="text-[#4e342e]/60 font-black text-xs uppercase tracking-[0.4em] mt-2">Find your rhythm</p>
      </div>
    </div>
  );

  const renderStart = () => {
    const languageOptions = [
      { name: 'Tamil', label: 'தமிழ்', icon: 'fa-mug-hot', glow: true },
      { name: 'English', label: 'English', icon: 'fa-feather-pointed', glow: false },
      { name: 'Hindi', label: 'हिन्दी', icon: 'fa-guitar', glow: false },
      { name: 'Kannada', label: 'ಕನ್ನಡ', icon: 'fa-ship', glow: true },
      { name: 'Telugu', label: 'తెలుగు', icon: 'fa-tree', glow: false },
      { name: 'Malayalam', label: 'മലയാളം', icon: 'fa-mountain', glow: true },
    ];

    return (
      <div className="flex flex-col items-center w-full max-w-lg mx-auto animate-fade-in px-6 pt-24 pb-6 min-h-screen justify-center relative overflow-hidden">
        <Header />
        <div className="w-full text-center mb-10">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-[#4e342e]">What's your flavor today?</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-full max-w-sm">
          {languageOptions.map((lang, idx) => (
            <div key={idx} className="relative">
              {lang.glow && (
                <div className="glow-effect -left-2 top-1/2 -translate-y-1/2 opacity-60"></div>
              )}
              <button 
                onClick={() => handleOptionSelect(lang.name)}
                className="language-button active:scale-95 z-10 hover:bg-[#5d3f38] shadow-sm"
              >
                {lang.icon && <i className={`fa-solid ${lang.icon} text-lg text-[#f3e5d8] opacity-80`}></i>}
                <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{lang.label}</span>
              </button>
              {lang.glow && (
                <div className="glow-effect -right-2 top-1/2 -translate-y-1/2 opacity-60"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-[#4e342e]/40 font-bold text-[10px] tracking-[0.4em] uppercase">
          Powered by Gemini 3 Flash
        </div>
      </div>
    );
  };

  const renderQuiz = () => (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col pt-16 animate-fade-in">
      <Header />
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-transparent pb-32">
        {QUESTIONS.map((q, idx) => {
          if (idx === 0 || idx >= currentStep) return null;
          const answer = answers[q.id as keyof UserAnswers];
          return (
            <React.Fragment key={q.id}>
              <ChatBubble message={getQuestionText(idx)} isBot={true} />
              {answer && <ChatBubble message={answer} isBot={false} />}
            </React.Fragment>
          );
        })}
        {!isLoading && !error && (
          <div className="animate-fade-in-up">
            <ChatBubble message={getQuestionText(currentStep)} isBot={true} />
            <div className="flex flex-wrap gap-3 mt-6 justify-start pl-2">
              {QUESTIONS[currentStep].options.map((option) => (
                <Button 
                  key={option} 
                  variant="outline" 
                  size="md" 
                  onClick={() => handleOptionSelect(option)} 
                  className="px-6 py-4 font-black text-sm uppercase tracking-wider shadow-sm bg-white border-[#4e342e]/10 hover:bg-[#4e342e] hover:text-white hover:border-transparent transition-all"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );

  const renderResults = () => {
    const mainYoutubeLink = recommendations?.[0] ? getYoutubeLink(recommendations[0]) : '#';

    return (
      <div className="w-full max-w-5xl mx-auto px-4 pt-20 pb-12 flex flex-col items-center animate-fade-in min-h-screen">
        <Header />
        <h2 className="font-serif text-2xl md:text-4xl text-[#4e342e] mb-12 text-center tracking-tight leading-snug px-4">
          Here's Your {answers.mood?.split('/')[0]} Soundtrack!
        </h2>

        {/* Simplified Song Boxes - Just Name and Artist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full max-w-4xl px-4">
          {recommendations?.map((song, idx) => {
            const isLast = idx === (recommendations.length - 1);
            
            return (
              <a 
                key={idx} 
                href={getYoutubeLink(song)} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group block transition-all duration-300 hover:-translate-y-2 ${isLast && recommendations.length % 2 !== 0 ? 'sm:col-span-2 lg:col-span-1 flex justify-center' : ''}`}
              >
                <div className={`bg-[#d5c3b1] p-6 rounded-2xl shadow-xl flex flex-col justify-center border border-white/20 transform group-hover:rotate-1 min-h-[120px] w-full text-center transition-all group-hover:bg-[#cbb8a4]`}>
                  <h3 className="text-white font-black text-lg md:text-xl line-clamp-2 leading-tight uppercase tracking-widest drop-shadow-md">
                    {song.name}
                  </h3>
                  <div className="mt-3 h-0.5 w-12 bg-white/30 mx-auto rounded-full group-hover:w-20 transition-all duration-500"></div>
                  <p className="text-white/80 text-xs md:text-sm uppercase tracking-tighter mt-3 line-clamp-1 italic font-bold">
                    {song.artist}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Main Action Button */}
        <div className="w-full flex flex-col items-center space-y-8 pb-10">
          <a href={mainYoutubeLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-sm transform active:scale-95 transition-transform">
            <Button size="lg" className="w-full py-5 text-lg md:text-xl uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(255,140,0,0.5)]">
              Listen on YouTube
            </Button>
          </a>
          
          <button 
            onClick={handleReset} 
            className="text-[#4e342e]/30 hover:text-[#4e342e] font-black uppercase text-[10px] tracking-[0.4em] transition-all pb-1 hover:opacity-100"
          >
            Start Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3e5d8] flex flex-col items-center justify-center overflow-x-hidden font-sans">
      <div className="w-full flex flex-col items-center justify-center">
        {view === 'splash' && renderSplash()}
        {view === 'start' && renderStart()}
        {view === 'quiz' && renderQuiz()}
        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center h-screen space-y-10 animate-fade-in text-center px-10">
            <div className="relative">
              <div className="w-28 h-28 border-[12px] border-[#4e342e]/10 border-t-[#FF8C00] rounded-full animate-spin"></div>
              <img src={LOGO_URL} alt="Logo" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 object-contain" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#4e342e] tracking-tighter uppercase">Curating your mix... 🎧</p>
              <p className="text-[#4e342e]/60 font-black text-[10px] uppercase tracking-[0.4em] mt-4">Handpicking the best tracks</p>
            </div>
          </div>
        )}
        {view === 'results' && renderResults()}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { height: 2rem; } 50% { height: 1.2rem; } }
        @keyframes bounce-normal { 0%, 100% { height: 3rem; } 50% { height: 1.8rem; } }
        @keyframes bounce-fast { 0%, 100% { height: 1.5rem; } 50% { height: 2.5rem; } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 1.4s ease-in-out infinite; }
        .animate-bounce-normal { animation: bounce-normal 1s ease-in-out infinite; }
        .animate-bounce-fast { animation: bounce-fast 0.7s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
