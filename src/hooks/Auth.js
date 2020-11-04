import React, { createContext, useCallback, useState, useContext } from 'react';
import lunaApi from '../api/lunaApi';

const AuthContext = createContext({access_token: '', signIn: () => {}, getToken: () => {}});

const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const access_token = localStorage.getItem('@Luna:access_token');

    if (access_token) {
      return { access_token };
    }

    return {}
  });

  const signIn = useCallback(async ({ code, redirect_uri }) => {
    const response = await lunaApi.post('/token/exchange', {
      redirect_uri,
      code,
    });

    const { access_token } = response.data;
    
    localStorage.setItem('@Luna:access_token', access_token);
    
    setData({access_token});

    return response.data;
  }, []);
  
  const getToken = useCallback(() => {
    const access_token = localStorage.getItem('@Luna:access_token');
    return access_token;   
  
  }, []);

  return (
    <AuthContext.Provider
      value={{access_token: data.access_token, signIn, getToken}}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must have an AuthProvider');

  return context;
}

export { AuthProvider, useAuth };