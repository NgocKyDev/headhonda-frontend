import { useState, useRef, useEffect } from 'react';
import '../Chatbot.css';
const API_URL = 'https://tavern-liability-preplan.ngrok-free.dev/api/v1/chat';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Xin chào 👋\n\nEm là Tuất Vinh - nhân viên chăm sóc khách hàng của HEAD Honda.\nEm có thể tư vấn sản phẩm, giá và tình trạng còn hàng.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const result = await response.json();

      let botText = result.message || result.data || result.response || result.answer || result.result || '❌ Không có phản hồi.';
      setMessages(prev => [...prev, { type: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: '❌ Không kết nối được server.' }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Nút mở chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: 20, right: 20, zIndex: 1000,
            width: 60, height: 60, borderRadius: '50%', background: '#c41230',
            color: 'white', border: 'none', fontSize: 28, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          💬
        </button>
      )}

      {/* Khung chat */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 90, right: 20, zIndex: 1000,
          width: 380, height: 500, background: 'white', borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: '#c41230', color: 'white', padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 15 }}>Tuất Vinh</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>CSKH HEAD Honda</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer' }}>✕</button>
          </div>

          {/* Chat Body */}
          <div ref={chatBodyRef} style={{ flex: 1, overflowY: 'auto', padding: 14, background: '#f7f7f7' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 14,
              }}>
                {msg.type === 'bot' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, fontSize: 16 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '75%', padding: 12, borderRadius: 14,
                  background: msg.type === 'user' ? '#c41230' : 'white',
                  color: msg.type === 'user' ? 'white' : '#333',
                  border: msg.type === 'bot' ? '1px solid #ddd' : 'none',
                  fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
                <div style={{ background: 'white', padding: '10px 14px', borderRadius: 14, border: '1px solid #ddd' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: '#999', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1s infinite' }} />
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: '#999', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1s infinite 0.2s' }} />
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: '#999', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1s infinite 0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #ddd', background: 'white' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi..."
              style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 20, outline: 'none', fontSize: 14 }}
            />
            <button
              onClick={sendMessage}
              style={{ width: 45, marginLeft: 8, border: 'none', borderRadius: '50%', background: '#c41230', color: 'white', fontSize: 18, cursor: 'pointer' }}
            >
              ➤
            </button>
          </div>

          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); opacity: 0.3; }
              50% { transform: translateY(-4px); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}