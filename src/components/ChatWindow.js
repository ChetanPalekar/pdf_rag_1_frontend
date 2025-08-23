import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ chatHistory, addMessage, isConnected }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading || !isConnected) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/retrieval/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage,
          options: {
            retrievalLimit: 5,
            scoreThreshold: 0.7,
            model: 'gpt-4',
            maxTokens: 1000,
            temperature: 0.7
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: result.data.response,
          metadata: {
            documentsFound: result.data.retrieval.documentsFound,
            sources: result.data.context.sources,
            processingTime: result.data.performance.totalTime
          },
          timestamp: new Date().toISOString()
        };

        addMessage(botMessage);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      };

      addMessage(errorMessage);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'user':
        return <User size={20} className="message-icon user" />;
      case 'bot':
        return <Bot size={20} className="message-icon bot" />;
      case 'error':
        return <AlertCircle size={20} className="message-icon error" />;
      default:
        return <User size={20} className="message-icon" />;
    }
  };

  const getMessageClass = (type) => {
    switch (type) {
      case 'user':
        return 'message user-message';
      case 'bot':
        return 'message bot-message';
      case 'error':
        return 'message error-message';
      default:
        return 'message';
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Chat with Your Documents</h2>
        <p>Ask questions about your uploaded PDFs and get AI-powered answers</p>
      </div>

      <div className="chat-messages">
        {chatHistory.length === 0 ? (
          <div className="empty-chat">
            <Bot size={48} className="empty-icon" />
            <h3>No messages yet</h3>
            <p>
              Start a conversation by asking questions about your uploaded documents. 
              The AI will search through your indexed content and provide relevant answers.
            </p>
          </div>
        ) : (
          chatHistory.map((message) => (
            <div key={message.id} className={getMessageClass(message.type)}>
              <div className="message-header">
                {getMessageIcon(message.type)}
                <span className="message-time">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              
              <div className="message-content">
                {message.type === 'bot' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
              
              {message.type === 'bot' && message.metadata && (
                <div className="message-metadata">
                  <span>📚 {message.metadata.documentsFound} documents found</span>
                  {message.metadata.sources && message.metadata.sources.length > 0 && (
                    <span>📁 Sources: {message.metadata.sources.join(', ')}</span>
                  )}
                  <span>⏱️ {message.metadata.processingTime}</span>
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="message-header">
              {getMessageIcon('bot')}
              <span className="message-time">Now</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <Loader2 size={16} className="spinner" />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              !isConnected 
                ? "Cannot connect to server..." 
                : "Ask a question about your documents..."
            }
            className="chat-input"
            disabled={isLoading || !isConnected}
          />
          
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !inputMessage.trim() || !isConnected}
          >
            <Send size={16} />
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        {!isConnected && (
          <div className="connection-warning">
            <AlertCircle size={16} />
            <span>Server connection required to chat</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatWindow; 