import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Users = () => {
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
          setFilteredUsers(data);
        } else {
          toast.error("Error while fetching the user");
        }
      });
  };

  const handleSearch = (e) => {
    const values = e.target.value.toLowerCase();
    setSearchTerm(values);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(values) ||
        user.email.toLowerCase().includes(values) ||
        user.address.toLowerCase().includes(values) ||
        user.role?.toLowerCase().includes(values)
    );

    setFilteredUsers(filtered);
  };

  const onAddUser = (data) => {
    console.log(data);
    axios.post(`http://localhost:4000/auth/signup`, data).then((res) => {
      const result = res.data;
      if (result["status"] === "success") {
        toast.success("User Added");
        getAllUsers();
        reset();
        closeSidePanel();
      } else {
        toast.error("error while register");
      }
    });
  };

  const openSidePanel = () => setIsSidePanelVisible(true);

  const closeSidePanel = () => {
    setIsSidePanelVisible(false);
  };
  const handleSorting = (e) => {
    const sort = e.target.value;
    setSortOption(sort);
    const sorted = [...filteredUsers].sort((a, b) =>
      sort === "name-asc"
        ? a.name.localeCompare(b.name)
        : sort === "name-desc"
        ? b.name.localeCompare(a.name)
        : sort === "email-asc"
        ? a.email.localeCompare(b.email)
        : sort === "email-desc"
        ? b.email.localeCompare(a.email)
        : 0
    );
    
    setFilteredUsers(sorted);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <div className="row">
        <div className={isSidePanelVisible ? "col-8" : "col-12"}>
          <div className="card">
            <div className="card-header bg-primary d-flex justify-content-between text-white">
              <h3>User List</h3>
              <form classname="d-flex" role="search">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </form>
              <div className="d-flex align-items-center">
                <label className="form-label mb-0">Order By:</label>
                <select
                  className="form-select ms-4"
                  style={{ width: "200px" }}
                  onChange={handleSorting}
                >
                  <option value="">-- Select --</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="email-asc">Email (A-Z)</option>
                  <option value="email-desc">Email (Z-A)</option>
                </select>
              </div>
              <button
                className="btn btn-sm btn-success"
                onClick={openSidePanel}
              >
                Add User
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                {filteredUsers.map((p) => (
                  <div
                    key={p.userId}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
                  >
                    <div className="card shadow" style={{ width: "18rem" }}>
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.email}</p>
                        <b className="card-text">{p.address}</b>
                        <br />
                        <p className="card-text">
                          Role - <b>{p.role}</b>{" "}
                        </p>
                        {p.role === "store_owner" && (
                          <p>
                            Average Rating : <b>{Math.floor(p.rating) || 0}</b>{" "}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {isSidePanelVisible && (
          <div className="col-4">
            <div className="card">
              <div className="card-header bg-primary d-flex justify-content-between text-white">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={closeSidePanel}
                >
                  Close
                </button>
              </div>
              <div className="card-body">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-5">
                      Add User
                    </h2>

                    <form onSubmit={handleSubmit(onAddUser)}>
                      <div data-mdb-input-init className="form-outline mb-4 ">
                        <div className="">
                          <label className="form-label" for="form3Example1cg">
                            Name
                          </label>
                          <input
                            type="text"
                            id="form3Example1cg"
                            className={`form-control ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            {...register("name", {
                              required: true,
                              minLength: 20,
                              maxLength: 60,
                            })}
                          />
                          {errors.name && (
                            <div className="invalid-feedback">
                              Name must be between 20 and 60 characters.
                            </div>
                          )}
                        </div>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" for="form3Example3cg">
                          Email
                        </label>
                        <input
                          type="email"
                          id="form3Example3cg"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            Invalid Email Address.
                          </div>
                        )}
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" for="form3Example4cg">
                          Password
                        </label>
                        <input
                          type="password"
                          id="form3Example4cg"
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          {...register("password", {
                            required: true,
                            minLength: 8,
                            maxLength: 16,
                            pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])/,
                          })}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            Password must be 8–16 characters, include an
                            uppercase letter and a special character.
                          </div>
                        )}
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" for="form3Example3cg">
                          Address
                        </label>
                        <textarea
                          type="email"
                          id="form3Example3cg"
                          className={`form-control ${
                            errors.address ? "is-invalid" : ""
                          }`}
                          rows={3}
                          {...register("address", {
                            required: true,
                            maxLength: 400,
                          })}
                        />
                        {errors.address && (
                          <div className="invalid-feedback">
                            Address cannot exceed 400 characters.
                          </div>
                        )}
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="owner">
                          Select Role
                        </label>
                        <select
                          id="role"
                          className={`form-select ${
                            errors.role ? "is-invalid" : ""
                          }`}
                          {...register("role", { required: true })}
                        >
                          <option value="">Select Role</option>
                          <option value="admin">System Administrator</option>
                          <option value="user">Normal User</option>
                          <option value="store_owner">Store Owner</option>
                        </select>
                        {errors.role && (
                          <div className="invalid-feedback">
                            Please select a role.
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        >
                          Add User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
