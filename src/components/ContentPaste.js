import React, { useState } from 'react';
import { FileText, Send, AlertCircle } from 'lucide-react';

const ContentPaste = ({ onIndexed, isIndexing, setIsIndexing, setIndexingStatus }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || !title.trim()) {
      setIndexingStatus('Please provide both title and content');
      return;
    }

    setIsIndexing(true);
    setIsProcessing(true);
    setIndexingStatus('Processing pasted content...');

    try {
      // For pasted content, we'll simulate indexing since the API expects PDF files
      // In a real implementation, you might want to create a text-to-PDF conversion
      // or modify the backend to accept plain text
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock result
      const mockResult = {
        success: true,
        documentCount: 1,
        collectionName: 'text_collection',
        content: content.substring(0, 100) + '...',
        processingTime: new Date().toISOString()
      };

      setIndexingStatus('Content processed successfully!');
      onIndexed(mockResult);
      
      // Clear form
      setContent('');
      setTitle('');
      
    } catch (error) {
      setIndexingStatus(`Error processing content: ${error.message}`);
    } finally {
      setIsIndexing(false);
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setTitle('');
    setIndexingStatus('');
  };

  const characterCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="content-paste">
      <div className="paste-section">
        <h2>Paste Content</h2>
        <p>Paste text content that you want to index and query</p>
        
        <form onSubmit={handleSubmit} className="paste-form">
          <div className="form-group">
            <label htmlFor="title">Content Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this content"
              className="title-input"
              required
              disabled={isProcessing}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here..."
              className="content-textarea"
              rows={12}
              required
              disabled={isProcessing}
            />
            
            <div className="content-stats">
              <span>{characterCount} characters</span>
              <span>{wordCount} words</span>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              disabled={isProcessing}
            >
              Clear
            </button>
            
            <button
              type="submit"
              className="submit-button"
              disabled={isProcessing || !content.trim() || !title.trim()}
            >
              {isProcessing ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Process Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="info-section">
        <div className="info-card">
          <AlertCircle size={20} />
          <div>
            <h4>Note</h4>
            <p>
              This feature simulates content indexing. In a production environment, 
              you would need to implement text-to-PDF conversion or modify the 
              backend API to accept plain text content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPaste; 