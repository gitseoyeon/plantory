// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/register";
import Home from "./pages/home";
import OAuthCallback from "./pages/oauthCallback";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  // Debug: log current pathname
  console.log("Current pathname:", location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  // Ensure Router wraps everything, and AppLayout uses useLocation inside Router context.
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
