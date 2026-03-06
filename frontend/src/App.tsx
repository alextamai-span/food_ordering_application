import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AccountRegister from "./pages/accountRegister";
import AccountLogin from "./pages/accountLogin";

import EmpMenu from "./pages/empMenu";
import GuestMenu from "./pages/guestMenu";

import EmpOrder from "./pages/empOrder";
import Cart from "./pages/cart";
import GuestOrder from "./pages/guestOrder";

export default function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />

        <Route path="/register" element={<AccountRegister />} />
        <Route path="/login" element={<AccountLogin />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/emp/menu" element={<EmpMenu />} />
        <Route path="/guest/menu" element={<GuestMenu />} />

        <Route path="/emp/order" element={<EmpOrder />} />
        <Route path="/guest/order" element={<GuestOrder />} /> 
      </Routes>
    </>
  );
};