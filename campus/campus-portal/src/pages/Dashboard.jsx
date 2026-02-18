import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const modules = [
    { title: "Classroom Booking", icon: "📚", path: "/book-classroom" },
    { title: "Lab Booking", icon: "🧪", path: "/book-lab" },
    { title: "Event Hall", icon: "🏛", path: "/book-hall" },
    { title: "Library Station", icon: "🪑", path: "/book-library" },
    { title: "Canteen Slot", icon: "🍽", path: "/book-canteen" },
    { title: "Library Books", icon: "📖", path: "/borrow-books" },
    { title: "My Bookings", icon: "📋", path: "/my-bookings" },
    ...(user?.role === "ADMIN" ? [{ title: "Admin Approvals", icon: "🛡", path: "/admin-approval" }] : []),
  ];

  if (!user) return null;
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">

        <div className="dashboard-header">
          <div>
            <h2>Welcome  {user.name}</h2>
            <p>{user.role}</p>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          {modules.map((module, index) => (
            <div
              key={index}
              className="dashboard-card"
              onClick={() => navigate(module.path)}
            >
              <div className="card-icon">{module.icon}</div>
              <h3>{module.title}</h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
export default Dashboard;
