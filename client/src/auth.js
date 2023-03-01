import React, { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const login = user => {
    setUser(user);
  };

  const logout = () => {
    setUser({});
  };

  // const fetchUser = async () => {
  //   const accessToken =
  //     localStorage.getItem('accessToken') &&
  //     JSON.parse(localStorage.getItem('accessToken'));

  //   if (accessToken) {
  //     try {
  //       const res = await fetch('url', {
  //         method: 'POST',
  //         body: JSON.stringify({ accessToken: accessToken }),
  //       });
  //       const data = await res.json();
  //       if (data?.isSuccess) {
  //         login({
  //           ...data,
  //           accessToken,
  //         });
  //       } else {
  //         localStorage.removeItem('accessToken');
  //         logout();
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     logout();
  //   }
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
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
