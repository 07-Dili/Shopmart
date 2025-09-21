import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faBox, faUsers, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-700">
          Admin Panel
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            <li>
              <Link
                to="products"
                className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition"
              >
                <FontAwesomeIcon icon={faCube} />
                <span>Manage Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="orders"
                className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition"
              >
                <FontAwesomeIcon icon={faBox} />
                <span>Manage Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="users"
                className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition"
              >
                <FontAwesomeIcon icon={faUsers} />
                <span>Manage Users</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white border-b-2 border-gray-200">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}