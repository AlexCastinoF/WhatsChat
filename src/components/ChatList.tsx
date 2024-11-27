import React from 'react';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import type { Message } from '../types/api';

interface ChatListProps {
  chats: { [phoneNumber: string]: Message[] };
  selectedChat: string | null;
  onSelectChat: (phoneNumber: string) => void;
}

export function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  return (
    <div className="w-80 border-r bg-white overflow-y-auto">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="divide-y">
        {Object.entries(chats).map(([phoneNumber, messages]) => {
          const lastMessage = messages[messages.length - 1];
          return (
            <button
              key={phoneNumber}
              onClick={() => onSelectChat(phoneNumber)}
              className={`w-full p-4 text-left hover:bg-gray-50 flex items-start space-x-3 ${
                selectedChat === phoneNumber ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="font-medium">{phoneNumber}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(lastMessage.timestamp), 'HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{lastMessage.content}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}