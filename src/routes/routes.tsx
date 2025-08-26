import { Route, Routes } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import Request from "@/pages/Request";
import Home from "@/pages/Home";
import Utilisateurs from "@/pages/Utilisateurs";
import History from "@/pages/History";
import Error from "@/Error/Error";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Services from "@/pages/Services";
import Categories from "@/pages/Categories";


const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Fixed signup route */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />

      {/* ✅ Nested routes under DashboardLayout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="" element={<Home />} />
        <Route path="utilisateurs" element={<Utilisateurs />} />
        <Route path="history" element={<History />} />
        <Route path="request" element={<Request />} />
        <Route path="service" element={<Services/>} />
        <Route path="categories" element={<Categories />} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

