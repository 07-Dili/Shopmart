import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <main className="pt-20 px-4">
          <AppRoutes />
        </main>
        <ToastContainer position="top-center" autoClose={1500} hideProgressBar newestOnTop className="z-[9999]" />
      </div>
    </AuthProvider>
  );
}

export default App;