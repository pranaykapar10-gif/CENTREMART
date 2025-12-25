'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  text: string;
  timestamp: Date;
  agentName?: string;
}

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline';
  avatar: string;
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      text: 'Welcome to TechStore Support! We are here to help.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState<Agent | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agentsRef = useRef<Agent[]>([
    { id: '1', name: 'Sarah', status: 'online', avatar: '👩‍💼' },
    { id: '2', name: 'Mike', status: 'busy', avatar: '👨‍💼' },
    { id: '3', name: 'Emma', status: 'online', avatar: '👩‍💻' },
  ]);

  const generateResponse = (userInput: string): string => {
    const responses: { [key: string]: string } = {
      'order': 'I can help you track your order. Could you please provide your order number?',
      'return': 'We accept returns within 30 days. What product would you like to return?',
      'refund': 'Let me help you with your refund. Can you provide your order details?',
      'shipping': 'We offer fast shipping options. What would you like to know about shipping?',
      'product': 'I\'d be happy to help you find a product. What are you looking for?',
      'payment': 'Do you have any issues with payment? I can assist you.',
      'account': 'I can help you with your account. What do you need?',
      'default': 'Thank you for contacting us! How can I assist you further?',
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        return response;
      }
    }

    return responses.default;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    // Generate unique ID for message
    const generateId = () => `${Date.now()}-${Math.random()}`;
    const messageId = generateId();

    // Add user message
    const userMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Assign agent if not already assigned
    setAssignedAgent((currentAgent) => {
      if (currentAgent) return currentAgent;
      const randomIdx = Math.floor(Math.random() * agentsRef.current.length);
      return agentsRef.current[randomIdx];
    });

    // Simulate agent response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const agentMessageId = generateId();
    const agentMessage: ChatMessage = {
      id: agentMessageId,
      type: 'agent',
      text: generateResponse(input),
      timestamp: new Date(),
      agentName: assignedAgent?.name || 'Support Team',
    };

    setMessages((prev) => [...prev, agentMessage]);
    setLoading(false);
  }, [input, assignedAgent]);

  const quickReplies = [
    'Track my order',
    'Return a product',
    'Billing issue',
    'Shipping question',
    'Product info',
  ];

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition transform hover:scale-110 z-40"
        title="Open support chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Support</h3>
              <p className="text-xs text-blue-100">
                {assignedAgent ? `Chatting with ${assignedAgent.name}` : 'Average response: 2 min'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-500 p-2 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Agent Info */}
          {assignedAgent && (
            <div className="px-4 py-3 bg-blue-50 border-b border-gray-200 flex items-center gap-3">
              <span className="text-2xl">{assignedAgent.avatar}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{assignedAgent.name}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      assignedAgent.status === 'online'
                        ? 'bg-green-500'
                        : assignedAgent.status === 'busy'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                    }`}
                  />
                  {assignedAgent.status.charAt(0).toUpperCase() + assignedAgent.status.slice(1)}
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-gray-700" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader size={16} className="text-blue-600 animate-spin" />
                </div>
                <div className="max-w-xs px-4 py-2 rounded-lg bg-white border border-gray-200 rounded-bl-none">
                  <p className="text-sm text-gray-600">Agent is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-white space-y-2">
              <p className="text-xs font-semibold text-gray-600">Quick topics:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(reply);
                      setTimeout(() => {
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now().toString(),
                            type: 'user',
                            text: reply,
                            timestamp: new Date(),
                          },
                        ]);
                        handleSendMessage();
                      }, 100);
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded-full text-gray-700 font-semibold transition"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 outline-none bg-gray-50 px-3 py-2 rounded-lg text-sm border border-gray-200 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
