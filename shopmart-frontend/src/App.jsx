import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <div className="pt-20 px-4">
          <AppRoutes />
        </div>
        <ToastContainer position="top-center" autoClose={1500} hideProgressBar newestOnTop className="z-[9999]" />
      </div>
  );
}

export default App;