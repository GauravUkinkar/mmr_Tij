import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AddDetails from "./pages/dash/AddDetails";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Otp from "./pages/auth/Otp";
import NewPassword from "./pages/auth/NewPassword";
import Four04 from "./pages/Four04";
import AddClient from "./pages/client/AddClient";
import AddVendors from "./pages/vendors/Vendors";
import DataView from "./pages/dash/DataView";
import AddSuport from "./pages/dash/AddSuport";
import Header from "./comps/Header";
import { useEffect, useState } from "react";
import ContextProvider from "./Context";
import AddInvoice from "./pages/dash/AddInvoice";


function App() {
  const [isLogin, setIsLogin] = useState(() => localStorage.getItem("login") === "true");

  useEffect(() => {
    const login = localStorage.getItem("login");
    setIsLogin(login === "true");
  }, []);

  return (
    <ContextProvider>
    <BrowserRouter>
      {isLogin && <Header setIsLogin={setIsLogin} />}
      <Routes>
        {!isLogin ? (
          <>
            <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<DataView  />} />
            <Route path="/add" element={<AddDetails  />} />
            <Route path="/add-client" element={<AddClient />} />
            <Route path="/add-vendor" element={<AddVendors />} />
            <Route path="/add-suport" element={<AddSuport />} />
            <Route path="/add-invoice" element={<AddInvoice />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Four04 />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
