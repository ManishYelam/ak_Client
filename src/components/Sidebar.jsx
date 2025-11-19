import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { name: "Dashboard", path: user.role === "admin" ? "/admin" : "/client" },
    { name: "Cases", path: "/cases" },
    { name: "Clients", path: "/clients" },
    { name: "Calendar", path: "/calendar" },
    { name: "Documents", path: "/documents" },
    { name: "Payments", path: "/payments" },
  ];

  return (
    <aside className="bg-green-600 text-white w-64 min-h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Advocate System</h2>
      <nav className="flex flex-col space-y-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            className="hover:bg-green-700 px-3 py-2 rounded transition"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
