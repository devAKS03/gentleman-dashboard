import { useLayoutEffect } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import { IoHome, IoBarChart, IoSettingsSharp, IoConstructOutline, IoLayersOutline, IoSettingsOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { FaHistory, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { TbLayoutDashboard } from "react-icons/tb";

import { useDispatch } from "react-redux";
import { logOut } from "@/Redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);
  const setOpen = useSidebarStore((state) => state.setOpen);
  const setMobile = useSidebarStore((state) => state.setMobile);

  const location = useLocation();


    const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/"); // redirect to login page
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setMobile(mobile);
      setOpen(!mobile); // Close sidebar if mobile, open if desktop
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobile, setOpen]);

  const sidebarVariants = {
    open: { width: "16rem" },
    closed: { width: "4rem" },
  };

  const menuItems = [
    { to: "/dashboard", icon: <IoHome className="w-5 h-5" />, text: "Tableau de bord" },
    { to: "/dashboard/utilisateurs", icon: <IoBarChart className="w-5 h-5" />, text: "Utilisateurs" },
    { to: "/dashboard/history", icon: <FaHistory className="w-5 h-5" />, text: "Historique" },
    { to: "/dashboard/request", icon: <IoCheckmarkCircleOutline className="w-5 h-5 " />, text: "Requêtes" },
    { to: "/dashboard/service", icon: <IoConstructOutline className="w-5 h-5" />, text: "Service" },
    { to: "/dashboard/categories", icon: <IoLayersOutline className="w-5 h-5" />, text: "Catégorie" },
    { to: "/dashboard/setting", icon: <IoSettingsOutline className="w-5 h-5" />, text: "paramètre" },
  ];

  return (
    <motion.aside
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-[#111827] text-white border-r min-h-screen p-4 overflow-hidden flex flex-col ${
        !isOpen ? "px-2 items-center" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">
          {isOpen ? "Admin Panel" : <TbLayoutDashboard className="w-7 h-7" />}
        </h2>
        <Button className="ms-1" variant="ghost" size="sm" onClick={toggle}>
          {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
        </Button>
      </div>

      <nav className="flex-1 mt-12">
        <TooltipProvider delayDuration={100}>
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <motion.li
                  key={item.to}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {!isOpen ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.to}
                          className={`w-10 h-10 flex items-center justify-center p-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-[#F9AA43] text-black"
                              : "hover:bg-[#F9AA43] hover:text-black"
                          }`}
                        >
                          {item.icon}
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="ml-2">
                        {item.text}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={`flex items-center justify-start p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#F9AA43] text-black"
                          : "hover:bg-[#F9AA43] hover:text-black"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-2 font-medium">{item.text}</span>
                    </NavLink>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>


      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-400 text-white cursor-pointer"
        >
          <FiLogOut className="w-5 h-5" />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </div> 
    </motion.aside>
  );
};

export default Sidebar;
