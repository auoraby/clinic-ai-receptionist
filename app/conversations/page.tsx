'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { useAuth } from '@/lib/context/auth-context';
import { clinicStore } from '@/lib/store';
import { 
  MessageSquareText, 
  Bot, 
  UserCheck, 
  Send, 
  AlertTriangle, 
  Phone, 
  ShieldAlert, 
  CheckCheck,
  Search
} from 'lucide-react';

export default function ConversationsPage() {
  const { activeClinic } = useClinic();
  const { user } = useAuth();
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-101');
  const [replyInput, setReplyInput] = useState('');
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);

  const refresh = () => setTick(t => t + 1);

  const conversations = clinicStore.getConversations(activeClinic.id);
  const filtered = conversations.filter(c => c.patientName.includes(search) || c.patientPhone.includes(search));

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const messages = activeConv ? clinicStore.getMessages(activeConv.id) : [];

  const handleSendStaffReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeConv) return;

    clinicStore.addStaffMessage(activeConv.id, user?.name || 'موظف الاستقبال', replyInput.trim());
    setReplyInput('');
    refresh();
  };

  const handleToggleTakeover = (isTakeover: boolean) => {
    if (!activeConv) return;
    clinicStore.toggleHumanTakeover(activeConv.id, isTakeover);
    refresh();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 dir-rtl">
      
      {/* Right Column: Conversations Sidebar */}
      <div className="w-full md:w-80 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-teal-600" />
              محادثات الواتساب
            </h2>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              Meta WhatsApp API
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث عن مريض..."
              className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">لا توجد محادثات</div>
          ) : (
            filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                className={`w-full text-right p-3.5 transition flex items-start justify-between gap-2 ${
                  selectedConvId === c.id ? 'bg-teal-50/70 border-r-4 border-teal-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">{c.patientName}</span>
                    {c.isHumanTakeover && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="تدخل بشري نشط" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{c.lastMessageText}</p>
                </div>

                <div className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(c.lastMessageTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Left Column: Active Chat Interface */}
      {activeConv ? (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          
          {/* Chat Header & Takeover Controls */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">{activeConv.patientName}</span>
                <span className="text-xs text-slate-500 font-mono">({activeConv.patientPhone})</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>حالة المساعد:</span>
                {activeConv.isHumanTakeover ? (
                  <span className="text-red-600 font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> تم التوقف عن الرد الآلي (تدخل بشري)
                  </span>
                ) : (
                  <span className="text-teal-600 font-extrabold flex items-center gap-1">
                    <Bot className="w-3 h-3" /> المساعد الآلي يجيب تلقائياً
                  </span>
                )}
              </div>
            </div>

            {/* Toggle Button */}
            <div>
              {activeConv.isHumanTakeover ? (
                <button
                  onClick={() => handleToggleTakeover(false)}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" /> إعادة تفعيل المساعد الآلي
                </button>
              ) : (
                <button
                  onClick={() => handleToggleTakeover(true)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> التكفل بالمحادثة يدوياً (Takeover)
                </button>
              )}
            </div>
          </div>

          {/* Messages Log Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.senderType === 'PATIENT' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    m.senderType === 'PATIENT'
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-tr-none shadow-sm'
                      : m.isMedicalSafeguardRefusal
                      ? 'bg-amber-100 border border-amber-300 text-amber-900 rounded-tl-none font-semibold'
                      : 'bg-navy-900 text-white rounded-tl-none shadow'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 font-bold mb-1 border-b border-current/10 pb-1">
                    <span>{m.senderName || m.senderType}</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {m.isMedicalSafeguardRefusal && (
                    <div className="mt-1 text-[10px] text-amber-800 font-extrabold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-700" />
                      تنبيه الأمان الطبي: تم الرفض وحجب التشخيص الآلي
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer for Staff */}
          <form onSubmit={handleSendStaffReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="اكتب رد الاستقبال اليدوي هنا أرسله عبر WhatsApp..."
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <Send className="w-4 h-4" /> إرسال
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
          اختر محادثة من القائمة
        </div>
      )}

    </div>
  );
}
