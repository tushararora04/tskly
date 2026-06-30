import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import BoardsPage from './pages/BoardsPage.jsx'
import BoardPage from './pages/BoardPage.jsx'
import useAuthStore from './store/authStore.js'

function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token)
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><BoardsPage /></PrivateRoute>} />
        <Route path="/board/:id" element={<PrivateRoute><BoardPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App