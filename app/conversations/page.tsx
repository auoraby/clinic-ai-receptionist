'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClinic } from '@/lib/context/clinic-context';
import { useAuth } from '@/lib/context/auth-context';
import { clinicStore } from '@/lib/store';
import { 
  MessageSquareText, 
  Bot, 
  UserCheck, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
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
    <div className="page-wrapper h-[calc(100vh-7rem)] flex flex-col md:flex-row gap-6 animate-fade-up">
      
      {/* Right Column: Conversations Sidebar */}
      <div className="card w-full md:w-80 flex flex-col overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-blue-600" />
              محادثات الواتساب
            </h2>
            <span className="badge badge-blue">
              Meta API
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث عن مريض..."
              className="input pl-3 pr-9 py-2 w-full text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">لا توجد محادثات</div>
          ) : (
            filtered.map(c => (
              <motion.button
                whileHover={{ x: -2 }}
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                className={`w-full text-right p-4 transition flex items-start justify-between gap-3 ${
                  selectedConvId === c.id ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-slate-50 border-r-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                    {c.patientName.charAt(0)}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 truncate">{c.patientName}</span>
                      {c.isHumanTakeover && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-sm" title="تدخل بشري نشط" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">{c.lastMessageText}</p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 whitespace-nowrap font-medium mt-1">
                  {new Date(c.lastMessageTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Left Column: Active Chat Interface */}
      {activeConv ? (
        <div className="card flex-1 flex flex-col overflow-hidden">
          
          {/* Chat Header & Takeover Controls */}
          <div className="p-5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                {activeConv.patientName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900">{activeConv.patientName}</span>
                  <span className="text-xs text-slate-500 font-medium dir-ltr">{activeConv.patientPhone}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1 font-medium">
                  {activeConv.isHumanTakeover ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> تكفل يدوي
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> رد آلي مفعل
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              {activeConv.isHumanTakeover ? (
                <button
                  onClick={() => handleToggleTakeover(false)}
                  className="btn btn-success text-xs py-2 px-4 flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" /> تفعيل البوت
                </button>
              ) : (
                <button
                  onClick={() => handleToggleTakeover(true)}
                  className="btn btn-danger text-xs py-2 px-4 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" /> تكفل يدوي
                </button>
              )}
            </div>
          </div>

          {/* Messages Log Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map(m => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id}
                className={`flex flex-col ${
                  m.senderType === 'PATIENT' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-md p-4 text-xs leading-relaxed space-y-1.5 shadow-sm ${
                    m.senderType === 'PATIENT'
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-2xl rounded-tr-none'
                      : m.isMedicalSafeguardRefusal
                      ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl rounded-tl-none font-semibold'
                      : 'bg-blue-50 border border-blue-100 text-blue-900 rounded-2xl rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-70 font-bold mb-1">
                    <span>{m.senderName || m.senderType}</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <p className="whitespace-pre-wrap font-medium">{m.content}</p>

                  {m.isMedicalSafeguardRefusal && (
                    <div className="mt-2 text-[10px] text-amber-700 font-bold flex items-center gap-1.5 p-2 bg-amber-100/50 rounded-lg">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      تنبيه: تم الرفض وحجب التشخيص الآلي
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Footer for Staff */}
          <form onSubmit={handleSendStaffReply} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="اكتب رد الاستقبال اليدوي هنا..."
              className="input flex-1"
            />
            <button
              type="submit"
              className="btn btn-primary px-6 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> إرسال
            </button>
          </form>

        </div>
      ) : (
        <div className="card flex-1 flex items-center justify-center text-slate-400 bg-slate-50 border-dashed border-2 border-slate-200">
          <div className="text-center space-y-2">
            <MessageSquareText className="w-8 h-8 mx-auto opacity-20" />
            <p className="font-medium text-sm">اختر محادثة من القائمة</p>
          </div>
        </div>
      )}

    </div>
  );
}
