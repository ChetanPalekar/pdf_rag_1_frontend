import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ContentPaste from './components/ContentPaste';
import ChatWindow from './components/ChatWindow';
import Header from './components/Header';
import { MessageCircle, Upload, FileText, Brain } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingStatus, setIndexingStatus] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch('https://pdf-rag-1-ap1i.onrender.com/health');
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
      console.error('API connection failed:', error);
    }
  };

  const handleFileIndexed = (result) => {
    setIndexingStatus(`Successfully indexed ${result.documentCount} document chunks`);
    // Switch to chat tab after successful indexing
    setTimeout(() => setActiveTab('chat'), 2000);
  };

  const handleContentIndexed = (result) => {
    setIndexingStatus(`Successfully indexed pasted content`);
    // Switch to chat tab after successful indexing
    setTimeout(() => setActiveTab('chat'), 2000);
  };

  const addMessage = (message) => {
    setChatHistory(prev => [...prev, message]);
  };

  const tabs = [
    { id: 'upload', label: 'Upload PDF', icon: <Upload size={20} /> },
    { id: 'paste', label: 'Paste Content', icon: <FileText size={20} /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircle size={20} /> }
  ];

  return (
    <div className="App">
      <Header isConnected={isConnected} />
      
      <main className="main-content">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Status Bar */}
        {indexingStatus && (
          <div className="status-bar success">
            <Brain size={16} />
            <span>{indexingStatus}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'upload' && (
            <FileUpload 
              onIndexed={handleFileIndexed}
              isIndexing={isIndexing}
              setIsIndexing={setIsIndexing}
              setIndexingStatus={setIndexingStatus}
            />
          )}
          
          {activeTab === 'paste' && (
            <ContentPaste 
              onIndexed={handleContentIndexed}
              isIndexing={isIndexing}
              setIsIndexing={setIsIndexing}
              setIndexingStatus={setIndexingStatus}
            />
          )}
          
          {activeTab === 'chat' && (
            <ChatWindow 
              chatHistory={chatHistory}
              addMessage={addMessage}
              isConnected={isConnected}
            />
          )}
        </div>
      </main>

      {/* Connection Status */}
      {!isConnected && (
        <div className="connection-warning">
          <div className="warning-content">
            <Brain size={20} />
            <span>Warning: Cannot connect to RAG API server</span>
            <button onClick={checkApiConnection} className="retry-button">
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
