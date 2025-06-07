import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const StoreOwnerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const getUserList = () => {
    axios
      .get(`http://localhost:4000/rating/user`, {
        headers: { "x-token": token },
      })
      .then((res) => {
        const result = res.data;
        if (result["status"] === "success") {
          const data = result["data"];
          setUsers(data);
        } else {
          toast.error("Error while fetching the store");
        }
      });
  };

  const getAllStores = () => {
    axios.get(`http://localhost:4000/store/get`).then((res) => {
      const result = res.data;
      if (result["status"] === "success") {
        const data = result["data"];
        const filtered = data.filter((s) => s.ownerId === decodedToken.id);
        setStores(filtered);
      } else {
        toast.error("Error while fetching the store");
      }
    });
  };
  useEffect(() => {
    getUserList();
    getAllStores();
  }, []);
  return (
    <>
      <div className="container mt-4 d-flex flex-column">
        <h3 className="text-center mb-4">Store Owner Dashboard</h3>

        <div className="row flex-grow-1 gx-4 gy-4 justify-content-center">
          {stores && stores.length > 0 ? (
            stores.map((p) => (
              <div
                key={p.product_id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
              >
                <div className="card w-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text" style={{ fontSize: "0.9rem" }}>
                      {p.address}
                    </p>
                    <span>
                      Avg Rating -
                      <b className="card-text"> {Math.floor(p.rating) || 0}</b>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <div className="container mt-4 d-flex flex-column table-responsive">
        <table className="table table-striped table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th style={{ cursor: "pointer" }}>Store Name</th>
              <th style={{ cursor: "pointer" }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>

                <td>{user.storeName}</td>
                <td>{user.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StoreOwnerDashboard;
