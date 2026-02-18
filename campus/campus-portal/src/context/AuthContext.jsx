import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(null);

  const login = (email, password) => {
    const token = btoa(`${email}:${password}`);
    setCredentials({ email, token });
  };

  const logout = () => {
    setCredentials(null);
  };

  return (
    <AuthContext.Provider value={{ credentials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
