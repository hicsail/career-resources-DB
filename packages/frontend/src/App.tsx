import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home.page.tsx';
import { AdminPage } from './pages/admin.page.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Add more pages here as needed */}
      </Routes>
    </Router>
  );
}

export default App;