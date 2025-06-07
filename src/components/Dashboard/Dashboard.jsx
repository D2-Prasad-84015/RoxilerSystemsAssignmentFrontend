import AdminDashboard from "./AdminDashboard";
import { jwtDecode } from "jwt-decode";
import UserDashboard from "./UserDashboard";
import StoreOwnerDashboard from "./StoreOwnerDashboard";

const Dashboard = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "user") {
    return <UserDashboard />;
  } else if (role === "store_owner") {
    return <StoreOwnerDashboard />;
  } else {
    return <p>Loading.....</p>;
  }
};

export default Dashboard;
