# 🚀 RAG Assistant Frontend

A modern React frontend for the RAG (Retrieval-Augmented Generation) system that allows users to upload PDFs, paste content, and chat with AI about their documents.

## ✨ Features

- **📁 PDF Upload**: Drag and drop PDF files for indexing
- **📝 Content Pasting**: Paste text content for processing
- **💬 AI Chat**: Ask questions about your documents
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind-inspired styling
- **📱 Mobile Friendly**: Responsive design that works on all devices
- **🔗 Real-time Connection**: Live connection status to the RAG API

## 🏗️ Architecture

```
Frontend (React) ←→ RAG API Server ←→ Qdrant Vector DB
                ←→ OpenAI API (Embeddings + GPT)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- RAG API server running on port 3000
- OpenAI API key configured

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Frontend

```bash
npm start
```

The frontend will open at `http://localhost:3001` (since port 3000 is used by the RAG API).

### 3. Start the RAG API Server

In another terminal, start your RAG API server:

```bash
cd ../
npm run dev
```

## 🎯 How to Use

### 1. Upload PDFs
- Go to the "Upload PDF" tab
- Drag and drop PDF files or click to select
- Click "Index Files" to process them
- Files will be indexed and stored in the vector database

### 2. Paste Content
- Go to the "Paste Content" tab
- Enter a title and paste your text content
- Click "Process Content" to index it
- Note: This is currently simulated (see limitations below)

### 3. Chat with Documents
- Go to the "Chat" tab
- Ask questions about your uploaded documents
- The AI will search through your content and provide answers
- View metadata about which documents were used

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.js        # App header with connection status
│   │   ├── FileUpload.js    # PDF upload component
│   │   ├── ContentPaste.js  # Text content input
│   │   └── ChatWindow.js    # AI chat interface
│   ├── App.js               # Main app component
│   ├── App.css              # Comprehensive styling
│   └── index.js             # App entry point
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

### Key Components

#### Header Component
- Displays app title and logo
- Shows real-time connection status to RAG API
- Responsive design for mobile devices

#### FileUpload Component
- Drag and drop PDF file upload
- Multiple file support
- Progress tracking and status indicators
- File validation and error handling

#### ContentPaste Component
- Text input for pasting content
- Character and word count
- Form validation
- Note: Currently simulated (see limitations)

#### ChatWindow Component
- Real-time chat interface
- Message history with timestamps
- AI response generation
- Markdown rendering for responses
- Connection status indicators

## 🎨 Styling

The frontend uses custom CSS with:
- Modern color scheme and gradients
- Responsive design patterns
- Smooth animations and transitions
- Consistent spacing and typography
- Mobile-first approach

## 🔧 Configuration

### API Endpoints

The frontend connects to these RAG API endpoints:

- `POST /api/indexing/pdf` - Upload and index PDF files
- `POST /api/retrieval/query` - Ask questions and get AI responses
- `GET /health` - Check API health status

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_APP_NAME=RAG Assistant
```

## 📱 Responsive Design

The frontend is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚧 Current Limitations

1. **Content Pasting**: The text content indexing is currently simulated. In production, you'd need to:
   - Implement text-to-PDF conversion
   - Modify the backend to accept plain text
   - Or create a separate text indexing endpoint

2. **File Types**: Currently only supports PDF files
3. **Authentication**: No user authentication system
4. **File Storage**: Files are processed and then deleted (not stored permanently)

## 🔮 Future Enhancements

- [ ] Support for more file types (DOCX, TXT, MD)
- [ ] User authentication and file management
- [ ] Real-time collaboration features
- [ ] Advanced search and filtering
- [ ] Export chat conversations
- [ ] Dark mode theme
- [ ] Offline support with service workers

## 🧪 Testing

### Manual Testing

1. **Upload Test**: Try uploading different PDF files
2. **Chat Test**: Ask various questions about your documents
3. **Error Handling**: Test with invalid files or network issues
4. **Responsive Test**: Test on different screen sizes

### Automated Testing

```bash
npm test
```

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**
- Check if port 3001 is available
- Ensure all dependencies are installed

**Can't connect to RAG API**
- Verify the RAG API server is running on port 3000
- Check the connection status in the header
- Ensure CORS is properly configured

**PDF upload fails**
- Check file size (max 10MB)
- Ensure file is a valid PDF
- Check browser console for errors

**Chat not working**
- Verify documents are indexed first
- Check API connection status
- Ensure OpenAI API key is configured

### Debug Mode

Enable debug logging in the browser console to see detailed API requests and responses.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section above
- Review the browser console for errors
- Ensure both frontend and backend are running
- Check the RAG API server logs

---

**Built with ❤️ using React, modern CSS, and the RAG API**
