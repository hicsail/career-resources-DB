import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home.page.tsx';
import { AdminPage } from './pages/admin.page.tsx';
import { SnackbarProvider } from './contexts/snackbar.context.tsx';

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <Routes>
          <Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>          
        </Routes>
      </SnackbarProvider>
    </Router>
  );
}

export default App;