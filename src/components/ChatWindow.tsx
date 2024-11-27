import React from 'react';
import { format } from 'date-fns';
import { Send, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { Message } from '../types/api';
import { sendMessage } from '../services/api';

interface ChatWindowProps {
  messages: Message[];
  recipient: string;
  onSendMessage: (message: Message) => void;
}

export function ChatWindow({ messages, recipient, onSendMessage }: ChatWindowProps) {
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipient) return;

    const message: Message = {
      id: Date.now().toString(),
      from: 'business',
      to: recipient,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'pending'
    };

    onSendMessage(message);
    setNewMessage('');

    try {
      const response = await sendMessage(recipient, newMessage);
      onSendMessage({
        ...message,
        status: 'sent',
        id: response.messages[0].id
      });
    } catch (error) {
      onSendMessage({
        ...message,
        status: 'failed',
        error: (error as Error).message
      });
    }
  };

  const StatusIcon = ({ status, error }: { status: Message['status']; error?: string }) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-gray-400" title="Pending" />;
      case 'sent':
        return <CheckCircle2 size={16} className="text-green-500" title="Sent" />;
      case 'delivered':
        return <CheckCircle2 size={16} className="text-blue-500" title="Delivered" />;
      case 'read':
        return (
          <div className="flex">
            <CheckCircle2 size={16} className="text-blue-500" title="Read" />
            <CheckCircle2 size={16} className="text-blue-500 -ml-1" />
          </div>
        );
      case 'failed':
        return <XCircle size={16} className="text-red-500" title={error || 'Failed'} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="font-medium">{recipient}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from === 'business' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.from === 'business'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <p>{message.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-75">
                  {format(new Date(message.timestamp), 'HH:mm')}
                </span>
                {message.from === 'business' && (
                  <StatusIcon status={message.status} error={message.error} />
                )}
              </div>
              {message.status === 'failed' && (
                <p className="text-xs text-red-200 mt-1">{message.error}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={!recipient || !newMessage.trim()}
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}