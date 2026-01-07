import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  authAPI,
  saveToken,
  saveUser,
  getToken,
  getUser,
  removeToken,
  removeUser,
  onUnauthorized, // Import the listener
} from "../services/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();

    // Listen for 401 errors from server at any time
    onUnauthorized(() => {
      setUser(null);
    });
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      const savedUser = await getUser();

      if (token && savedUser) {
        // Verify token is still valid
        try {
          const response = await authAPI.getMe();
          setUser(response.data.data);
        } catch (error) {
          // Token invalid, clear storage
          await removeToken();
          await removeUser();
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    console.log("Login success:", response.data.message);
    const { user: userData, token } = response.data.data;

    await saveToken(token);
    await saveUser(userData);
    setUser(userData);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await authAPI.register({ username, email, password });
    // We don't save token or set user here because the user wants to log in manually after registration
  };

  const logout = async () => {
    console.log("Starting logout process...");
    try {
      await authAPI.logout();
      console.log("Backend logout successful");
    } catch (error) {
      console.error(
        "Backend logout error (safe to ignore if token expired):",
        error
      );
    } finally {
      await removeToken();
      await removeUser();
      setUser(null);
      console.log("Local auth state cleared");
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
