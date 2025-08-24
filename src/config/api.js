// API Configuration
const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://pdf-rag-1-frontend.vercel.app'
    : 'http://localhost:3000',
  
  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    INDEXING: '/api/indexing/pdf',
    RETRIEVAL: '/api/retrieval/query',
    CORS_TEST: '/cors-test'
  },
  
  // Full API URLs
  get HEALTH_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.HEALTH}`;
  },
  
  get INDEXING_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.INDEXING}`;
  },
  
  get RETRIEVAL_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.RETRIEVAL}`;
  },
  
  get CORS_TEST_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.CORS_TEST}`;
  }
};

export default API_CONFIG; 