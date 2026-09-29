/**
 * JAGO: Multilingual Tribal Scholarship Assistant UI
 * Strictly grounded in real backend facts, supporting English, Hindi, and Marathi.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Languages, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileText,
  CreditCard
} from 'lucide-react';
import { store } from '../services/store';
import { jagoService } from '../services/jagoService';
import { ChatMessage, SupportedLanguage } from '../types';

interface JagoAssistantViewProps {
  initialPrompt?: string;
  onNavigateTab?: (tab: string) => void;
}

export const JagoAssistantView: React.FC<JagoAssistantViewProps> = ({
  initialPrompt,
  onNavigateTab
}) => {
  const state = store.getState();
  const student = store.getActiveStudent();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(state.language);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on load
  useEffect(() => {
    const greetingText = activeLang === 'hi'
      ? `नमस्ते ${student.fullName} जी! मैं **जागो (JAGO)** हूँ — आपका जनजातीय छात्रवृत्ति सहायक। मैं आपके आवेदन, बोनाफाइड त्रुटी, डीबीटी भुगतान और पात्रता की जानकारी दे सकता हूँ।`
      : activeLang === 'mr'
        ? `नमस्कार ${student.fullName}! मी **जागो (JAGO)** — तुमचा शिष्यवृत्ती मार्गदर्शक. तुमच्या अर्जाची सद्यस्थिती किंवा बोनाफाइड त्रुटीबद्दल विचारू शकता.`
        : `Hello ${student.fullName}! I am **JAGO**, your official scholarship assistant. How can I assist you with your application, document corrections, or DBT payment today?`;

    setMessages([
      {
        id: 'msg-initial',
        sender: 'jago',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestions: [
          activeLang === 'hi' ? 'मेरे आवेदन की स्थिति क्या है?' : activeLang === 'mr' ? 'माझ्या अर्जाची स्थिती काय आहे?' : 'What is my application status?',
          activeLang === 'hi' ? 'बोनाफाइड त्रुटी कैसे ठीक करें?' : activeLang === 'mr' ? 'बोनाफाइड त्रुटी कशी सोडवावी?' : 'Why is my Bonafide flagged?',
          activeLang === 'hi' ? 'डीबीटी भुगतान कब मिलेगा?' : activeLang === 'mr' ? 'पेमेंट कधी जमा होणार?' : 'When will I receive my DBT payment?'
        ]
      }
    ]);
  }, [activeLang, student.fullName]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const resp = await jagoService.processUserQuery(query, activeLang);
      const jagoMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'jago',
        text: resp.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestions: resp.actionSuggestions,
        quickContext: resp.factualContext
      };
      setMessages(prev => [...prev, jagoMsg]);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    if (suggestionText.includes('Bonafide') || suggestionText.includes('बोनाफाइड')) {
      if (onNavigateTab) {
        onNavigateTab('applications');
        return;
      }
    }
    handleSend(suggestionText);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* JAGO Header Bar */}
      <div className="bg-stone-900 text-white p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white">JAGO (जागो)</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/40">
                Factual Grounding Active
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Ministry of Tribal Affairs Knowledge & Orchestration Assistant
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-stone-800 rounded px-2.5 py-1 border border-stone-700 text-xs">
          <Languages className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value as SupportedLanguage)}
            className="bg-transparent text-stone-200 outline-none cursor-pointer text-xs"
          >
            <option value="en" className="bg-stone-800">English</option>
            <option value="hi" className="bg-stone-800">हिन्दी</option>
            <option value="mr" className="bg-stone-800">मराठी</option>
          </select>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
              msg.sender === 'user'
                ? 'bg-amber-700 text-white font-semibold'
                : 'bg-stone-900 text-amber-400'
            }`}>
              {msg.sender === 'user' ? 'AP' : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-700 text-white rounded-tr-none shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-xs'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                
                {msg.quickContext && (
                  <div className="mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
                    Backend Context: {msg.quickContext}
                  </div>
                )}
                
                <span className={`block mt-1 text-[10px] text-right ${
                  msg.sender === 'user' ? 'text-amber-200' : 'text-stone-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Action Suggestions from JAGO */}
              {msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.actionSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(sug)}
                      className="text-[11px] bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 font-medium px-2.5 py-1 rounded-full border border-stone-200 hover:border-amber-300 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>{sug}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-stone-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-3 rounded-lg border border-stone-200 w-fit">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            <span>Consulting MoTA factual database...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              activeLang === 'hi' 
                ? 'जागो से छात्रवृत्ति, बोनाफाइड या डीबीटी के बारे में पूछें...'
                : activeLang === 'mr'
                  ? 'जागोला अर्ज, त्रुटी किंवा डीबीटी खात्याबद्दल विचारा...'
                  : 'Ask JAGO about application status, deficiency help, or DBT...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 text-center mt-1.5">
          JAGO strictly verifies facts from structured backend records. No fabricated status or amounts.
        </p>
      </div>
    </div>
  );
};
