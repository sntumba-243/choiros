import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Dashboard from './pages/Dashboard'
import ChoirDashboard from './pages/app/ChoirDashboard'
import Members from './pages/app/Members'
import Events from './pages/app/Events'
import Songs from './pages/app/Songs'
import Attendance from './pages/app/Attendance'
import Messages from './pages/app/Messages'
import Settings from './pages/app/Settings'
import OrgAdmin from './pages/admin/OrgAdmin'
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
  { path: '/app/choir/:choirId', element: protect(<ChoirDashboard />) },
  { path: '/app/choir/:choirId/members', element: protect(<Members />) },
  { path: '/app/choir/:choirId/events', element: protect(<Events />) },
  { path: '/app/choir/:choirId/songs', element: protect(<Songs />) },
  { path: '/app/choir/:choirId/attendance', element: protect(<Attendance />) },
  { path: '/app/choir/:choirId/messages', element: protect(<Messages />) },
  { path: '/app/choir/:choirId/settings', element: protect(<Settings />) },
  { path: '/admin', element: protect(<OrgAdmin />) },
  { path: '/admin/billing', element: protect(<Billing />) },
  { path: '*', element: <Navigate to="/" replace /> },
])

function App() {
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
