// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/register";
import Home from "./pages/home";
import OAuthCallback from "./pages/oauthCallback";
import MyPage from "./pages/myPage";
import UserProfile from "./pages/userProfile";
import PlantList from "./pages/plantList";
import useAuthStore from "./store/authStore";
import PlantDetail from "./pages/plantDetail";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  // Debug: log current pathname
  console.log("Current pathname:", location.pathname);

  const { isAuthenticated } = useAuthStore();

  console.log(isAuthenticated);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="/plants" element={<PlantList />} />
          <Route path="/plant/:plantId" element={<PlantDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
