import React, { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserReady, setIsUserReady] = useState(false);

  const login = user => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/session-user', {
        method: 'GET',
      });
      const data = await res.json();
      if (data && data.success && data.user && data.user.emailId) {
        login({
          ...data.user,
        });
      } else {
        logout();
      }
      setIsUserReady(true);
    } catch (error) {
      console.log(error);
      logout();
      setIsUserReady(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isUserReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
