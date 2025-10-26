// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
// 유저
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import OAuthCallback from "./pages/oauthCallback";
import useAuthStore from "./store/authStore";

// 식물 정보
import MyPage from "./pages/myPage";
import UserProfile from "./pages/userProfile";

// 식물 관리
import PlantDetail from "./pages/userPlantDetail";
import PlantList from "./components/userplant/PlantList";

//식물 백과사전
import PlantPage from "./pages/PlantPage";
import PlantDictionaryList from "./pages/PlantDictionaryList";
import PlantDictionaryDetail from "./pages/PlantDictionaryDetail";
import PlantIdentification from "./pages/PlantIdentification";

//커뮤니티
import Community from "./pages/community";
import PostDetail from "./components/post/PostDetail";
import PostForm from "./components/post/PostForm";
import PostList from "./components/post/PostList";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  const { isAuthenticated } = useAuthStore();

  console.log(isAuthenticated);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div>
        <Routes>
          {/* 유저 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />

          {/* 식물 관리 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          <Route path="/plants" element={<PlantList />} />
          <Route path="/plant/:plantId" element={<PlantDetail />} />
          
          {/* 식물정보 */}
          <Route path="/dictionary/*" element={<PlantPage />}>
            <Route path="list" element={<PlantDictionaryList />} />
            <Route path="identify" element={<PlantIdentification />} />
          </Route>
          <Route path="/dictionary/:id" element={<PlantDictionaryDetail />} />

          {/* 커뮤니티 */}
          <Route path="/community" element={<Community />} />
          <Route path="/community/write" element={<PostForm />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          {/* <Route path="/posts" element={<PostList />} /> */}
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
