import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { useTheme } from './hooks/useTheme'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Dashboard from './pages/Dashboard'
import MemberLayout from './pages/app/layout/MemberLayout'
import MemberHome from './pages/app/MemberHome'
import MemberEvents from './pages/app/MemberEvents'
import MemberSongs from './pages/app/MemberSongs'
import MemberProfile from './pages/app/MemberProfile'
import AdminLayout from './pages/admin/layout/AdminLayout'
import Overview from './pages/admin/Overview'
import AdminMembers from './pages/admin/Members'
import AdminEvents from './pages/admin/Events'
import AdminSongs from './pages/admin/Songs'
import AdminAttendance from './pages/admin/Attendance'
import AdminMessages from './pages/admin/Messages'
import AdminSettings from './pages/admin/Settings'
import Billing from './pages/admin/Billing'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const protect = (el: React.ReactNode) => <ProtectedRoute>{el}</ProtectedRoute>

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/register/success', element: <RegisterSuccess /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/dashboard', element: protect(<Dashboard />) },
  {
    path: '/app/choir/:choirId',
    element: protect(<MemberLayout />),
    children: [
      { index: true, element: <MemberHome /> },
      { path: 'events', element: <MemberEvents /> },
      { path: 'songs', element: <MemberSongs /> },
      { path: 'profile', element: <MemberProfile /> },
    ],
  },
  {
    path: '/admin',
    element: protect(<AdminLayout />),
    children: [
      { index: true, element: <Overview /> },
      { path: 'members', element: <AdminMembers /> },
      { path: 'events', element: <AdminEvents /> },
      { path: 'songs', element: <AdminSongs /> },
      { path: 'attendance', element: <AdminAttendance /> },
      { path: 'messages', element: <AdminMessages /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: 'billing', element: <Billing /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

function App() {
  useTheme()
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
