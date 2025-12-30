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
    console.log('toekn is in usefect context', token);
    // const decoded = jwtDecode(token);
    // console.log('decoed tokwn ', decoded);

    const performLogout = () => {
      logoutAction();
      setUser(null);
    };

    if (token) {
      try {

        const decoded = jwtDecode(token);
        console.log('decoed tokwn ', decoded);
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

  const Login = async (token) => {
    console.log("AuthContext received:", { token });

    if (!email) {
      return { success: false, error: "Missing credentials" };
    }

    // Pass data to the Action
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

