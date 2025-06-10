import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminStores from "./components/Pages/AdminStores";
import Users from "./components/Pages/Users";
import UpdatePassword from "./components/Pages/UpdatePassword";
import UserStores from "./components/Pages/UserStores";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Register />}/>
        <Route path="/signin" element={<Login />}/>
        <Route path="/" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/admin/stores" element={<AdminStores />}/>
        <Route path="/admin/users" element={<Users />}/>
        <Route path="/password/update" element={<UpdatePassword />}/>
        <Route path="/stores" element={<UserStores />}/>
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
