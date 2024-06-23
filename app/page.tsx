'use client'
import { useState, useCallback, useEffect } from 'react';
import useSocketIO from './api/socket/socket';
interface Message {
  sent: string, 
  message: string
}

const SocketIOComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sentMessage, setsentMessage] = useState<string>('')
  const [inputMessage, setInputMessage] = useState('');
  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, {sent:'system', message:message}]);
  }, []);

  const { isConnected, sendMessage } = useSocketIO('http://localhost:5000', handleNewMessage);

  const handleSend = () => {
    sendMessage(inputMessage);
    setMessages((prevMessages) => [...prevMessages, {sent:'user', message:inputMessage}])
    setInputMessage('');
  };

  return (
    <div className=''>
      <h1 className='font-bold text-3xl text-center text-sky-400'>Socket.IO Chat</h1>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg p-4">
        <div className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="block w-full p-4 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ask a question..."
            required
          />
          <button
            onClick={handleSend}
            className="absolute right-2.5 bottom-2.5 bg-blue-700 p-2 text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Send
          </button>
        </div>
      </div>
      <div className='p-20 pr-36 pl-36 text-white'>
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className={msg.sent === 'user' ? 'text-right' : 'text-left '}>
              {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocketIOComponent;
