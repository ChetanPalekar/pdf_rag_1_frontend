import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onIndexed, isIndexing, setIsIndexing, setIndexingStatus }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const indexFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsIndexing(true);
    setIndexingStatus('Indexing files...');

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const fileData = uploadedFiles[i];
        
        // Update progress
        setUploadProgress(prev => ({
          ...prev,
          [fileData.id]: 0
        }));

        const formData = new FormData();
        formData.append('pdf', fileData.file);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileData.id]: Math.min(prev[fileData.id] + 10, 90)
          }));
        }, 200);

        try {
          const response = await fetch('http://localhost:3000/api/indexing/pdf', {
            method: 'POST',
            body: formData
          });

          clearInterval(progressInterval);

          if (response.ok) {
            const result = await response.json();
            
            // Update file status
            setUploadedFiles(prev => prev.map(f => 
              f.id === fileData.id 
                ? { ...f, status: 'success', progress: 100 }
                : f
            ));

            setUploadProgress(prev => ({
              ...prev,
              [fileData.id]: 100
            }));

            // Call success callback
            onIndexed(result.data);
            
          } else {
            const error = await response.json();
            throw new Error(error.error || 'Indexing failed');
          }

        } catch (error) {
          clearInterval(progressInterval);
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'error', progress: 0 }
              : f
          ));

          setIndexingStatus(`Error indexing ${fileData.file.name}: ${error.message}`);
        }
      }

      setIndexingStatus('All files processed successfully!');
      
    } catch (error) {
      setIndexingStatus(`Error: ${error.message}`);
    } finally {
      setIsIndexing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="status-icon success" />;
      case 'error':
        return <AlertCircle size={16} className="status-icon error" />;
      default:
        return <FileText size={16} className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'pending';
    }
  };

  return (
    <div className="file-upload">
      <div className="upload-section">
        <h2>Upload PDF Files</h2>
        <p>Drag and drop PDF files here, or click to select files</p>
        
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload size={48} className="upload-icon" />
          <p>
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop PDF files here, or click to select'
            }
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Files</h3>
          
          {uploadedFiles.map((fileData) => (
            <div key={fileData.id} className={`file-item ${getStatusColor(fileData.status)}`}>
              <div className="file-info">
                {getStatusIcon(fileData.status)}
                <span className="file-name">{fileData.file.name}</span>
                <span className="file-size">
                  {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              
              <div className="file-actions">
                {fileData.status === 'pending' && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress[fileData.id] || 0}%` }}
                    />
                  </div>
                )}
                
                <button
                  onClick={() => removeFile(fileData.id)}
                  className="remove-button"
                  disabled={isIndexing}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={indexFiles}
            className="index-button"
            disabled={isIndexing || uploadedFiles.length === 0}
          >
            {isIndexing ? 'Indexing...' : `Index ${uploadedFiles.length} File(s)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 