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
import PrivateRoute from "./privateRoute";
import Setting from "@/pages/Setting";


const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Fixed signup route */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />

      {/* ✅ Nested routes under DashboardLayout */}
      {/* <Route path="/dashboard" element={<DashboardLayout />}> */}

       <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="" element={<Home />} />
        <Route path="utilisateurs" element={<Utilisateurs />} />
        <Route path="history" element={<History />} />
        <Route path="request" element={<Request />} />
        <Route path="service" element={<Services/>} />
        <Route path="categories" element={<Categories />} />
        <Route path="setting" element={<Setting/>} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

