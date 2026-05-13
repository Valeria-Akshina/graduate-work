import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { TableList } from './components/TableList';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tables" element={<TableList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
