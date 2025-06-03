'use client'

import { useEffect, useState } from 'react';
import socket from '@/utility/socket';
import { useSelector } from 'react-redux';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { token, user } = useSelector((state) => state.user);
  const senderId = user.id; // mock
  const receiverId = user.id === "680ce7a7bd49e89bd6b4953e" ? "681e1348deaa1150aed84491" : "680ce7a7bd49e89bd6b4953e"; // mock

  useEffect(() => {
    socket.emit('join', { userId: senderId });

    socket.on('private-message', ({ senderId, message }) => {
        console.log(`Message from ${senderId}: ${message}`);
      setMessages(prev => [...prev, { senderId, content: message }]);
    });

    return () => {
      socket.off('private-message');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('private-message', {
      senderId, receiverId, message
    });
    setMessages(prev => [...prev, { senderId, content: message }]);
    setMessage('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}><b>{msg.senderId}:</b> {msg.content}</div>
        ))}
      </div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
