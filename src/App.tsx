import React from 'react';
import { ConfigForm } from './components/ConfigForm';
import { ChatWindow } from './components/ChatWindow';
import { ChatList } from './components/ChatList';
import { useConfigStore } from './store/useConfigStore';
import { Settings } from 'lucide-react';
import type { Message } from './types/api';
import { initializeSocket } from './services/socket';

function App() {
  const { config } = useConfigStore();
  const [showConfig, setShowConfig] = React.useState(!config);
  const [chats, setChats] = React.useState<{ [phoneNumber: string]: Message[] }>({});
  const [selectedChat, setSelectedChat] = React.useState<string | null>(null);

  const handleConfigSaved = () => {
    setShowConfig(false);
  };

  const handleMessage = (message: Message) => {
    setChats(prev => {
      const phoneNumber = message.from === 'business' ? message.to : message.from;
      const existingMessages = prev[phoneNumber] || [];
      
      // Update existing message or add new one
      const updatedMessages = message.status === 'pending' || message.status === 'failed'
        ? existingMessages.map(msg => msg.id === message.id ? message : msg)
        : [...existingMessages, message];

      return {
        ...prev,
        [phoneNumber]: updatedMessages,
      };
    });
  };

  React.useEffect(() => {
    const cleanup = initializeSocket(handleMessage);
    return cleanup;
  }, []);

  if (showConfig) {
    return <ConfigForm onConfigSaved={handleConfigSaved} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 p-4 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">WhatsApp Business Chat</h1>
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 hover:bg-green-700 rounded-full"
            >
              <Settings size={24} />
            </button>
          </div>
          <div className="flex h-[calc(100vh-8rem)]">
            <ChatList
              chats={chats}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
            />
            {selectedChat ? (
              <ChatWindow
                messages={chats[selectedChat] || []}
                recipient={selectedChat}
                onSendMessage={handleMessage}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;