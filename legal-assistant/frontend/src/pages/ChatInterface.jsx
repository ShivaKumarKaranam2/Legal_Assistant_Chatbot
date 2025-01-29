import React, { useEffect, useState } from 'react';
import { Send, Scale, Menu, X, User, Pencil, Trash2, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const { darkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // User message
    const userMessage = {
        id: Date.now(),
        text: input,
        sender: 'user',
        timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Send message to API
    try {
        // Retrieve the token from your authentication context or local storage
        const token = localStorage.getItem('token'); // Adjust this line based on where you store your token

        const response = await axios.post(
          "http://127.0.0.1:8000/api/chat/legal-query/", 
          { query: input },
          { headers: { Authorization: `Bearer ${token}` }}
      );

        if (response.statusText!="OK") {
            throw new Error('Network response was not ok');
        }

        const data = await response.data;

        // AI response message
        const aiMessage = {
            id: Date.now() + 1,
            text: data.response || "Sorry, I couldn't process that.",
            sender: 'ai',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);


        if (data.key_points && data.key_points.length > 0) {
            data.key_points.forEach((point) => {
                const pointMessage = {
                    id: Date.now() + Math.random(), // Unique ID for each point
                    text: point,
                    sender: 'ai',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, pointMessage]);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// useEffect(() => {
//   console.log(messages, "messages");

// }, [messages]);


  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleRenameMessage = (messageId, newText) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, text: newText } : msg
    ));
    setEditingMessageId(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className={`h-screen flex ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-80 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out z-30 shadow-xl md:relative md:translate-x-0`}>
        <div className="h-full flex flex-col">
          {/* Account Details */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <User className="w-10 h-10 text-blue-600 bg-blue-100 dark:bg-blue-900 rounded-full p-2" />
              <div>
                <h3 className="font-medium">{user?.email}</h3>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center mt-1"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-4">Chat History</h2>
            <div className="space-y-3">
              {messages.filter(msg => msg.sender === 'user').map((message) => (
                <div key={message.id} className="flex items-start group">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    {editingMessageId === message.id ? (
                      <input
                        type="text"
                        defaultValue={message.text}
                        onBlur={(e) => handleRenameMessage(message.id, e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="hidden group-hover:flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => setEditingMessageId(message.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <Scale className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold">LegalAI Assistant</h1>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? ' dark:bg-gray-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                 {message.sender === 'ai' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown> // Use react-markdown here
                ) : (
                  <p>{message.text}</p>
                )}
                <span className="text-xs opacity=75">
                  {message.timestamp.toLocaleTimeString()}
                </span>

              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your legal question..."
              className="flex-1 rounded-lg border text-black border-gray-300 dark:border-gray=600 dark:bg-gray=700 px=4 py=2 focus:outline-none focus:ring=2 focus:ring-blue=500"
            />
            <button
              type="submit"
              className="dark:bg-gray-700 text-black rounded-lg px-4 py-2 hover:bg-slate-600 transition-colors cursor-pointer"
            >
              <Send className="w=5 h=5" />
            </button>
          </div>
        </form>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset=0 bg-black bg-opacity=50 z=20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
