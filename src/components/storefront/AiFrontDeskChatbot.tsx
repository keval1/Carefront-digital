import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Tenant, Service } from '../../types';

interface AiFrontDeskChatbotProps {
  tenant: Tenant;
  services: Service[];
  onOpenBooking: (service?: Service) => void;
  onOpenFinancing?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'patient';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'book' | 'financing';
    label: string;
    service?: Service;
  };
}

export const AiFrontDeskChatbot: React.FC<AiFrontDeskChatbotProps> = ({
  tenant,
  services,
  onOpenBooking,
  onOpenFinancing
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! Welcome to ${tenant.name}. I'm your 24/7 AI Medical Concierge. I can answer treatment questions, quote pricing, check Dr. Jenkins' schedule, or reserve an appointment with a refundable deposit. How can I assist you today?`,
      timestamp: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const patientMsg: ChatMessage = {
      id: `pat-${Date.now()}`,
      sender: 'patient',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, patientMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let responseText = '';
      let action: ChatMessage['suggestedAction'] = undefined;

      const matchedService = services.find(
        (s) =>
          q.includes(s.name.toLowerCase()) ||
          (s.slug && q.includes(s.slug.toLowerCase())) ||
          (s.category && q.includes(s.category.toLowerCase()))
      );

      if (q.includes('morpheus') || (matchedService && matchedService.name.toLowerCase().includes('morpheus'))) {
        const srv = matchedService || services[0];
        responseText = `Aura's signature ${srv.name} is priced at $${(srv.retailPriceCents / 100).toLocaleString()}. A $${srv.depositPriceCents / 100} refundable deposit locks your consultation and priority slot with Dr. Jenkins, with 0% Cherry financing starting from $${Math.round(srv.retailPriceCents / 100 / 12)}/month.`;
        action = {
          type: 'book',
          label: `Reserve ${srv.name} ($${srv.depositPriceCents / 100} Deposit)`,
          service: srv
        };
      } else if (q.includes('botox') || q.includes('tox') || q.includes('inject')) {
        const srv = services.find((s) => s.category === 'injectables') || services[1] || services[0];
        responseText = `Our clinical Botox protocol is administered exclusively by Dr. Jenkins or certified nurse injectors at $12–$14/unit. We have openings available this Thursday at 2:30 PM. Would you like to reserve a 30-minute consultation?`;
        action = {
          type: 'book',
          label: `Book Botox Consult with Dr. Jenkins`,
          service: srv
        };
      } else if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
        const featured = services.slice(0, 3).map((s) => `${s.name} ($${s.retailPriceCents / 100})`).join(', ');
        responseText = `Our popular clinical procedures include: ${featured}. All procedure reservations include a 100% refundable deposit applied directly to your treatment on arrival.`;
      } else if (q.includes('deposit') || q.includes('refundable')) {
        responseText = `Yes! All appointment deposits ($50 or $100 depending on protocol) are 100% refundable up to 24 hours prior to your scheduled arrival. 100% of the deposit applies directly to your treatment balance.`;
      } else if (q.includes('financing') || q.includes('cherry') || q.includes('apr') || q.includes('payment plan')) {
        responseText = `We offer 0% APR patient financing through Cherry. You can split treatments across 3, 6, 12, or 24 months with no hard credit pull and an 80% instant approval rate in 60 seconds!`;
        action = {
          type: 'financing',
          label: 'Check 0% APR Pre-Approval (60s)'
        };
      } else if (q.includes('hours') || q.includes('location') || q.includes('where') || q.includes('address')) {
        responseText = `We are located in the Wilshire Medical Suite at 9601 Wilshire Blvd, Ste 420, Beverly Hills, CA 90210. Clinical hours are Monday through Saturday, 9:00 AM – 6:00 PM.`;
      } else if (q.includes('book') || q.includes('appointment') || q.includes('schedule') || q.includes('opening')) {
        const srv = matchedService || services[0];
        responseText = `Dr. Jenkins has openings available this Thursday at 2:30 PM and Friday at 11:00 AM. Would you like to secure your slot now?`;
        action = {
          type: 'book',
          label: `Lock Thursday 2:30 PM Slot ($100 Deposit)`,
          service: srv
        };
      } else {
        responseText = `Thank you for your inquiry! Our clinical concierge is synced directly with Aesthetic Record EMR. Would you like me to reserve a priority consultation slot with Dr. Jenkins or review procedure pricing?`;
        action = {
          type: 'book',
          label: 'Book Consultation with Dr. Jenkins',
          service: services[0]
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickChips = [
    'Morpheus8 pricing',
    'Book with Dr. Jenkins',
    'Is deposit refundable?',
    '0% Cherry financing'
  ];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. FLOATING LAUNCHER BUTTON (BOTTOM RIGHT OF PRACTICE PAGE) */}
      {/* ======================================================== */}
      <div className="absolute bottom-6 right-6 z-40 select-none">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 bg-[#1C1917] hover:bg-stone-800 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl border border-stone-700/60 transition-all duration-200 hover:scale-105 cursor-pointer"
            title="Chat with Aura 24/7 AI Front Desk"
          >
            {/* Pulsing online status indicator */}
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="absolute w-4 h-4 rounded-full bg-emerald-400/30 animate-ping" />
            </div>

            <div className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="w-3.5 h-3.5 text-emerald-200" />
            </div>

            <div className="text-left">
              <div className="text-xs font-semibold tracking-tight text-stone-100 flex items-center gap-1">
                <span>AI Front Desk</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <div className="text-[10px] text-stone-400 font-normal leading-tight">
                24/7 Concierge • Online
              </div>
            </div>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. CHATBOT MODAL WINDOW (BOTTOM RIGHT OF PRACTICE PAGE) */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="absolute bottom-6 right-6 z-50 w-84 sm:w-96 max-w-[calc(100%-2rem)] max-h-[calc(100%-3rem)] h-[520px] bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-[#1C1917] text-white px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-sm shadow-inner ring-1 ring-emerald-500/30">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1C1917]" />
              </div>

              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-tight">
                  <span>Aura AI Concierge</span>
                  <span className="text-[9px] font-normal px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                    Online
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 leading-tight">
                  24/7 Front Desk • Aesthetic Record Synced
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'patient'
                      ? 'bg-[#1C1917] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Suggested Action Card inside message */}
                {msg.suggestedAction && (
                  <div className="mt-2 w-[85%]">
                    {msg.suggestedAction.type === 'book' && (
                      <button
                        onClick={() => {
                          onOpenBooking(msg.suggestedAction?.service);
                          setIsOpen(false);
                        }}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white p-2.5 rounded-xl font-semibold text-xs flex items-center justify-between shadow-sm cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{msg.suggestedAction.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {msg.suggestedAction.type === 'financing' && (
                      <button
                        onClick={() => {
                          if (onOpenFinancing) onOpenFinancing();
                          else alert('Pre-approved for up to $3,500 with 0% APR via Cherry!');
                        }}
                        className="w-full bg-[#1C1917] hover:bg-stone-800 text-white p-2.5 rounded-xl font-semibold text-xs flex items-center justify-between shadow-sm cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                          <span>{msg.suggestedAction.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <span className="text-[9px] text-stone-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 bg-white border border-stone-200 rounded-2xl rounded-tl-xs w-20">
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-stone-100/70 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0 no-scrollbar">
            <span className="text-stone-400 font-semibold shrink-0">Try:</span>
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="bg-white hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200 whitespace-nowrap cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-stone-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about treatments, pricing, scheduling..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-[#1C1917] hover:bg-stone-800 disabled:opacity-40 text-white p-2 rounded-xl cursor-pointer transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[9px] text-stone-400 mt-1.5 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>HIPAA Compliant AI Front Desk</span>
              </span>
              <span>Chart Synced</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
