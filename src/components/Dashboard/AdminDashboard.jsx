import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);

  const getAllUsers = () => {
    axios
      .get(`http://localhost:4000/user/get`, {
        headers: { "x-token": sessionStorage.getItem("token") },
      })
      .then((res) => {
        const result = res.data;
        if (result["status"] === "success") {
          const data = result["data"];
          setUsers(data);
        } else {
          toast.error("Error while fetching the user");
        }
      });
  };

  const getAllStores = () => {
    axios.get(`http://localhost:4000/store/get`).then((res) => {
      const result = res.data;
      if (result["status"] === "success") {
        const data = result["data"];
        setStores(data);
      } else {
        toast.error("Error while fetching the store");
      }
    });
  };
  const getAllRatings = () => {
    axios.get(`http://localhost:4000/rating/get`).then((res) => {
      const result = res.data;
      if (result["status"] === "success") {
        const data = result["data"];
        setRatings(data);
      } else {
        toast.error("Error while fetching the store");
      }
    });
  };
  useEffect(() => {
    getAllUsers();
    getAllStores();
    getAllRatings();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Admin Dashboard</h1>
        <div className="row justify-content-center gy-4">
          <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body text-center">
                <i className="bi bi-person" style={{ fontSize: "60px" }}></i>
                <h5 className="card-title">Total Users</h5>
                <p className="card-text">{users.length}</p>
                <Link to="/admin/users" className="btn btn-primary">
                  View Users
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body text-center">
                <i className="bi bi-shop" style={{ fontSize: "60px" }}></i>
                <h5 className="card-title">Total Stores</h5>
                <p className="card-text">{stores.length}</p>
                <Link to="/admin/stores" className="btn btn-primary">
                  View Stores
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body text-center">
                <i className="bi bi-star-fill" style={{ fontSize: "60px" }}></i>
                <h5 className="card-title">Total Ratings</h5>
                <p className="card-text">{ratings.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
