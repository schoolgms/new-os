import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ExternalLink, Copy, Check, Trash2, Bot, User, Globe } from 'lucide-react';
import { ChatMessage, GroundingSource } from '../../types/os';
import { askGeminiCopilot } from '../../services/gemini';
import { soundEngine } from '../../services/audio';

const SUGGESTED_PROMPTS = [
  'How does NEW OS execute in the browser without an ISO?',
  'How do I deploy this OS to GitHub Pages automatically?',
  'Explain the Web Audio synthesizer architecture',
  'Write a JavaScript game loop function for NEW OS',
];

export const NovaAIApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **Nova AI**, your native intelligent copilot for **NEW OS**.

I am connected to **Gemini 3.8 Flash** with **Google Search Grounding**. Ask me anything about systems programming, OS architecture, code generation, or current real-world information.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    soundEngine.playClick();
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    // Build history for multi-turn chat
    const history = messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const result = await askGeminiCopilot(text, history);

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        sources: result.groundingSources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      soundEngine.playNotification();
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Sorry, encountered an error processing your query: ${e.message}`,
          timestamp: Date.now(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    soundEngine.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    soundEngine.playClick();
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: 'Conversation history reset. How can I assist you with NEW OS today?',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans">
      {/* Top Copilot Bar */}
      <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Nova Copilot</span>
          <span className="text-[10px] text-cyan-400 font-mono">Gemini 3.8 Flash</span>
        </div>

        <button
          onClick={handleClear}
          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 select-text ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-xs'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Search Grounding Sources (if available) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-cyan-300">
                      <Globe className="w-3 h-3" />
                      <span>Search Grounding Sources:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-cyan-200 transition-colors"
                        >
                          <span className="truncate max-w-[160px]">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message action footer */}
                {!isUser && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-indigo-300" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 text-xs items-center text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-1 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-[11px]">Nova is formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Composer */}
      <div className="p-3 border-t border-white/10 bg-black/40">
        <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl px-3 py-2 focus-within:border-cyan-400 transition-colors">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask Nova AI anything about NEW OS, web runtimes, code..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
