import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({ token });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Main handleLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const res = await axios.post(`https://syallabus-finder-backend.onrender.com${endpoint}`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };
 
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', color: '#007bff', border: 'none' }}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

function Main({ handleLogout }) {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [topics, setTopics] = useState([]);
  const [videoLinks, setVideoLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [sortBy, setSortBy] = useState('likeCount'); // New state for sorting preference

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
     try {
    const res = await axios.get('https://syallabus-finder-backend.onrender.com/history', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setHistory(res.data);
  } catch (err) {
    setError('Failed to fetch history');
  }
};

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setTopics([]);
      setVideoLinks([]);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a valid PDF file.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('syllabus', file);

    try {
      const res = await axios.post('https://syallabus-finder-backend.onrender.com/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: { language },
      });

      setTopics(res.data.topics);
      setVideoLinks(res.data.videoLinks);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing file');
    } finally {
      setLoading(false);
    }
  };

  // Function to get top 2 videos per topic based on sortBy
  const getTopVideos = (videoLinks) => {
    return videoLinks.map((item) => ({
      ...item,
      videos: [...item.videos]
        .sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0)) // Sort by likeCount or viewCount
        .slice(0, 2), // Take top 2
    }));
  };

  const topVideoLinks = getTopVideos(videoLinks);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Syllabus Video Finder</h1>
        <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none' }}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Upload Syllabus (PDF only):</label>
          <input type="file" onChange={handleFileChange} accept=".pdf" required />
          {file && <p>Selected: {file.name}</p>}
        </div>
        <div>
          <label>Select Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="te">Telugu</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: loading ? '#ccc' : '#007bff', color: '#fff', border: 'none' }}>
          {loading ? 'Processing...' : 'Get Videos'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Extracted Topics</h2>
        {topics.length > 0 ? (
          <ul>{topics.map((topic, index) => <li key={index}>{topic}</li>)}</ul>
        ) : (
          <p>No topics found.</p>
        )}
      </div>

      <div>
        <h2>Video Links</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="likeCount">Likes</option>
            <option value="viewCount">Views</option>
          </select>
        </div>
        {topVideoLinks.length > 0 ? (
          topVideoLinks.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>{item.topic}</h3>
              {item.videos.map((video, vidIndex) => (
                <div key={vidIndex} style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '10px 0' }}>
                  <a href={video.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                    {video.title}
                  </a>
                  <span style={{ color: '#555', fontSize: '0.9em' }}>
                    👍 {video.likeCount?.toLocaleString() || 'N/A'} | 👁️ {video.viewCount?.toLocaleString() || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No video links found.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Search History</h2>
        {history.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {history.map((entry, index) => (
              <li key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd' }}>
                <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                <p><strong>Language:</strong> {entry.language}</p>
                <p><strong>Topics:</strong> {entry.topics.join(', ')}</p>
                <ul>
                  {entry.videoLinks.map((item, i) => (
                    <li key={i}>
                      {item.topic}: {item.videos.map(v => (
                        <span key={v.link} style={{ marginRight: '10px' }}>
                          <a href={v.link} target="_blank" rel="noopener noreferrer">{v.title}</a>
                          {' '}👍 {v.likeCount?.toLocaleString() || 'N/A'} | 👁️ {v.viewCount?.toLocaleString() || 'N/A'}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No search history yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;