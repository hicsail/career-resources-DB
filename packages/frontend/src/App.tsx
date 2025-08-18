import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home.page.tsx';
import { AdminPage } from './pages/admin.page.tsx';
import { AuthCallbackPage } from './pages/auth-callback.page.tsx';
import { PermissionRequiredPage } from './pages/permission-required.page.tsx';
import { LogoutPage } from './pages/logout.page.tsx';
import { Paths } from './constants/paths';
import { SnackbarProvider } from './contexts/snackbar.context.tsx';
import { AdminGuard } from './guards/admin.guard';
import { AuthProvider } from './contexts/auth.context';
import { SettingsProvider } from './contexts/settings.context';
import { ApiProvider } from './services/api';

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <SettingsProvider>
          <AuthProvider>
            <ApiProvider>
              <Routes>
                {/* Public routes */}
                <Route path={Paths.HOME} element={<HomePage />} />
                <Route path={Paths.AUTH_CALLBACK} element={<AuthCallbackPage />} />
                <Route path={Paths.PERMISSION_REQUIRED} element={<PermissionRequiredPage />} />
                <Route path={Paths.LOGOUT} element={<LogoutPage />} />
                {/* Protected routes */}
                <Route element={<AdminGuard />}>
                  <Route path={Paths.ADMIN} element={<AdminPage />} />
                </Route>
              </Routes>
            </ApiProvider>
          </AuthProvider>
        </SettingsProvider>
      </SnackbarProvider>
    </Router>
  );
}

export default App;