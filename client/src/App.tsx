import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin.tsx'
import PlayerPage from './pages/PlayerPage'
import UserHome from './pages/UserHome'
import './App.css'

const ADMIN_AUTH_KEY = 'sf_admin_authed'
const ADMIN_TOKEN_KEY = 'sf_admin_token'

function App() {
  const isAdminAuthed = () =>
    typeof window !== 'undefined' &&
    window.localStorage.getItem(ADMIN_AUTH_KEY) === '1' &&
    Boolean(window.localStorage.getItem(ADMIN_TOKEN_KEY))

  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          isAdminAuthed() ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route path="/player" element={<PlayerPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
