// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import OAuthCallback from "./pages/oauthCallback";
import MyPage from "./pages/myPage";
import UserProfile from "./pages/userProfile";
import PlantRegister from "./pages/plantRegister";
import PlantDictionaryList from "./pages/PlantDictionaryList";
import PlantDictionaryDetail from "./pages/PlantDictionaryDetail";
import useAuthStore from "./store/authStore";
import PlantDetail from "./pages/userPlantDetail";
import Community from "./pages/community";
import PostCreate from "./pages/postCreate";
import PostDetail from "./components/post/PostDetail";
import PostItem from "./components/post/PostItem";
import PostForm from "./components/post/PostForm";
import PostList from "./components/post/PostList";
import PlantList from "./components/userplant/PlantList";

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
          <Route path="/plants" element={<PlantDictionaryList />} />
          <Route path="/plants/:id" element={<PlantDictionaryDetail />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          <Route path="/plants" element={<PlantList />} />
          <Route path="/plant/:plantId" element={<PlantDetail />} />

          <Route path="/community" element={<Community />} />
          <Route path="/community/write" element={<PostCreate />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:postId" element={<PostItem />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/edit/:postId" element={<PostForm />} />
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
