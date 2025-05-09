import './App.css';
import './styles/theme.css';
import Login from './pages/Login/Login';
import { useState } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {loggedIn ? <Dashboard /> : <Login onLogin={setLoggedIn} />}
    </>
  );
}

export default App;

