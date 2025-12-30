import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { loginAction, logoutAction } from "../api/authActions"; // <--- Import here

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize State on Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          performLogout();
        } else {
          setUser(decoded);
        }
      } catch (e) {
        performLogout();
      }
    }
    setLoading(false);
  }, []);

  // --- WRAPPER FUNCTION FOR LOGIN ---
  const performLogin = async (email, password) => {
    // 1. Call the Action
    const result = await loginAction(email, password);

    // 2. Update React State if successful
    if (result.success) {
      setUser(result.user);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  // --- WRAPPER FUNCTION FOR LOGOUT ---
  const performLogout = () => {
    // 1. Call the Action (clears localStorage)
    logoutAction();

    // 2. Update React State (clears UI)
    setUser(null);

    // 3. Redirect
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: performLogin,
        logout: performLogout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;

