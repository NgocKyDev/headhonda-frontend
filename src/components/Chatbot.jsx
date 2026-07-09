import { useState, useRef, useEffect } from 'react';

const API_URL = 'https://tavern-liability-preplan.ngrok-free.dev/api/v1/chat';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Xin chào! Tôi là Tuất Vinh - trợ lý ảo của HEAD Honda. Tôi có thể giúp gì cho bạn?\n\n💡 Bạn có thể hỏi:\n• Thông tin sản phẩm\n• Giá xe\n• Tình trạng còn hàng\n• Khuyến mãi' 
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
      const botText = result.message || result.data || result.response || result.answer || result.result || 'Xin lỗi, tôi chưa hiểu câu hỏi. Bạn có thể thử lại?';
      setMessages(prev => [...prev, { type: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: '❌ Hiện tại không thể kết nối. Vui lòng gọi hotline: 1900 1234' }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = ['🚗 Xe số', '🛵 Xe tay ga', '🏍️ Xe côn tay', '💰 Bảng giá', '🎉 Khuyến mãi'];

  return (
    <>
      {/* Nút chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 60, height: 60, borderRadius: '50%', 
          background: isOpen ? '#fff' : '#c41230',
          color: isOpen ? '#c41230' : '#fff',
          border: isOpen ? '2px solid #c41230' : 'none',
          fontSize: 26, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(196,18,48,0.3)',
          transition: 'all 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Chat với tư vấn viên"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Khung chat */}
      <div style={{
        position: 'fixed', bottom: 96, right: 24, zIndex: 1000,
        width: 380, height: 520, background: '#fff', borderRadius: 16,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        display: isOpen ? 'flex' : 'none', flexDirection: 'column',
        overflow: 'hidden', border: '1px solid #e0e0e0',
        animation: isOpen ? 'slideUp 0.3s ease' : 'none',
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #c41230 0%, #e94560 100%)',
          color: '#fff', padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ 
            width: 44, height: 44, borderRadius: '50%', 
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            🏍️
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>HEAD Honda Assistant</div>
            <div style={{ fontSize: 11, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              Online - Trả lời trong 1 phút
            </div>
          </div>
        </div>

        {/* Chat Body */}
        <div ref={chatBodyRef} style={{ 
          flex: 1, overflowY: 'auto', padding: '16px 14px',
          background: '#f8f9fa',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16, animation: 'fadeIn 0.3s ease',
            }}>
              {msg.type === 'bot' && (
                <div style={{ 
                  width: 34, height: 34, borderRadius: '50%', background: '#c41230',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: 8, flexShrink: 0, color: '#fff', fontSize: 16,
                }}>
                  🏍️
                </div>
              )}
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
                background: msg.type === 'user' ? '#c41230' : '#fff',
                color: msg.type === 'user' ? '#fff' : '#333',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                borderBottomRightRadius: msg.type === 'user' ? 4 : 16,
                borderBottomLeftRadius: msg.type === 'bot' ? 4 : 16,
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#c41230', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>🏍️</div>
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 16, borderBottomLeftRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#c41230',
                      animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div style={{ 
          padding: '8px 14px', display: 'flex', gap: 6, flexWrap: 'wrap',
          borderTop: '1px solid #eee', background: '#fff',
        }}>
          {quickReplies.map((reply, i) => (
            <button key={i} onClick={() => { setInput(reply); sendMessage(); }}
              style={{
                padding: '6px 12px', borderRadius: 20, border: '1px solid #e0e0e0',
                background: '#fff', color: '#c41230', fontSize: 12, cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#c41230'; e.target.style.color = '#fff'; e.target.style.borderColor = '#c41230'; }}
              onMouseLeave={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#c41230'; e.target.style.borderColor = '#e0e0e0'; }}
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Footer Input */}
        <div style={{ 
          padding: '10px 14px', borderTop: '1px solid #eee', background: '#fff',
          display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            style={{
              flex: 1, padding: '10px 16px', border: '2px solid #e0e0e0', borderRadius: 24,
              outline: 'none', fontSize: 14, background: '#f8f9fa', transition: 'border 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#c41230'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <button onClick={sendMessage} disabled={!input.trim()}
            style={{
              width: 42, height: 42, borderRadius: '50%', background: input.trim() ? '#c41230' : '#e0e0e0',
              color: '#fff', border: 'none', fontSize: 18, cursor: input.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ➤
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}