import Login from './pages/Login';
import SREDashboard from './pages/SREDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import { useUser } from './hooks/useUser';

function App() {
  const { token, role } = useUser();

  if (!token) {
    return <Login />;
  }

  return role === 'admin' ? <SREDashboard /> : <ExecutiveDashboard />;
}

export default App;
