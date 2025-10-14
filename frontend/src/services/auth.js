import api from "./api";
import StorageService from "./storage";

class AuthService {
  async login(userData) {
    const response = await api.post("/api/auth/login", userData);
    const { access_token, refresh_token, user } = response.data;

    StorageService.setAccessToken(access_token);
    StorageService.setRefreshToken(refresh_token);
    StorageService.setUser(user);

    return response.data;
  }

  async register(userData) {
    const response = await api.post("/api/auth/register", userData);
    const { access_token, refresh_token, user } = response.data;

    StorageService.setAccessToken(access_token);
    StorageService.setRefreshToken(refresh_token);
    StorageService.setUser(user);

    return response.data;
  }

  logout() {
    StorageService.clear();
  }

  getCurrentUser() {
    return StorageService.getUser();
  }

  isAuthenticated() {
    return !!StorageService.getAccessToken();
  }
}

// 싱글턴으로 export
export const authService = new AuthService();
