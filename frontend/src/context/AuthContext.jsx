import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { loginAction, logoutAction } from "../api/authActions"; // <--- Import here

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const performLogout = () => {
    logoutAction();
    setUser(null);
  };

  // Initialize State on Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log('toekn is in usefect context', token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log('decoed tokwn ', decoded);
        if (decoded.exp * 1000 < Date.now()) {
          performLogout();
        } else {
          setUser(decoded);
        }
      } catch (e) {
        console.log('error in useffect ', e);
        performLogout();
      }
    }
    setLoading(false);
  }, []);

  const Login = async (email, password) => {
    // console.log("AuthContext Login called with:", { email, password });

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const result = await loginAction(email, password);

    if (result.success) {
      setUser(result.user);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const Logout = () => {
    performLogout();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: Login,
        logout: Logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;

