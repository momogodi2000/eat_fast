import { useState, useEffect } from "react";
import { ArrowRight, Settings, Users, Truck, Coffee, Headset, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardRedirect() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const dashboards = [
    {
      title: "Admin Dashboard",
      description: "Manage system settings and users",
      icon: <Settings className="w-10 h-10 text-indigo-600" />,
      color: "from-indigo-500 to-indigo-700",
      hoverColor: "hover:from-indigo-600 hover:to-indigo-800",
      path: "/admin"
    },
    {
      title: "Client Dashboard",
      description: "Manage client accounts and orders",
      icon: <Users className="w-10 h-10 text-blue-600" />,
      color: "from-blue-500 to-blue-700",
      hoverColor: "hover:from-blue-600 hover:to-blue-800",
      path: "/clients"
    },
    {
      title: "Support Agent Dashboard",
      description: "Manage client accounts and orders",
      icon: <Headphones className="w-10 h-10 text-orange-600" />,
      color: "from-orange-500 to-amber-500",
      hoverColor: "hover:from-orange-600 hover:to-amber-600",
      path: "/agent/tickets"
    },
    {
      title: "Delivery Dashboard",
      description: "Track and manage deliveries",
      icon: <Truck className="w-10 h-10 text-green-600" />,
      color: "from-green-500 to-green-700",
      hoverColor: "hover:from-green-600 hover:to-green-800",
      path: "/delivery"
    },
    {
      title: "Restaurant Dashboard",
      description: "Manage menu and restaurant settings",
      icon: <Coffee className="w-10 h-10 text-red-600" />,
      color: "from-red-500 to-red-700",
      hoverColor: "hover:from-red-600 hover:to-red-800",
      path: "/restaurants_manager"
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 transform transition-all duration-700 ease-out translate-y-0">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Dashboard Selection
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the dashboard you want to access for testing the interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {dashboards.map((dashboard, index) => (
            <div 
              key={index}
              className={`
                transform perspective-1000 transition-all duration-500
                hover:scale-105 hover:rotate-y-12 hover:shadow-2xl
                ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              `}
              style={{ 
                transitionDelay: `${150 * index}ms`,
                transformStyle: 'preserve-3d'
              }}
            >
              <button
                onClick={() => handleNavigation(dashboard.path)}
                className={`
                  relative w-full h-64 rounded-2xl overflow-hidden
                  bg-gradient-to-br ${dashboard.color}
                  ${dashboard.hoverColor}
                  transition-all duration-300 ease-out
                  flex flex-col items-center justify-center p-6
                  shadow-lg shadow-black/30 group
                `}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full p-4 transform transition-transform duration-500 group-hover:rotate-12">
                    {dashboard.icon}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{dashboard.title}</h3>
                    <p className="text-sm text-white/70 mb-4">{dashboard.description}</p>
                    
                    <div className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md py-2 px-4 rounded-full transition-all duration-300 group-hover:bg-white/30">
                      <span>Access</span>
                      <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
                
                {/* 3D elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl transform transition-transform duration-700 group-hover:scale-150"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-3xl"></div>
                </div>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
          <p className="text-sm">
            Testing environment • Designed for development purposes
          </p>
        </div>
      </div>
    </div>
  );
}