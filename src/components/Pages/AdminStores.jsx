import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AdminStores = () => {
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const getAllStores = () => {
    axios.get(`http://localhost:4000/store/get`).then((res) => {
      const result = res.data;
      if (result["status"] === "success") {
        const data = result["data"];
        setStores(data);
        setFilteredStores(data);
      } else {
        toast.error("Error while fetching the store");
      }
    });
  };
  const getStoreOwner = () => {
    axios
      .get(`http://localhost:4000/user/get/owner`, {
        headers: { "x-token": sessionStorage.getItem("token") },
      })
      .then((res) => {
        const result = res.data;
        if (result["status"] === "success") {
          const data = result["data"];
          setOwners(data);
        } else {
          toast.error("Error while fetching the store");
        }
      });
  };

  const handleSearch = (e) => {
    const values = e.target.value.toLowerCase();
    setSearchTerm(values);

    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(values) ||
        store.email.toLowerCase().includes(values) ||
        store.address.toLowerCase().includes(values)
    );

    setFilteredStores(filtered);
  };

  const onAddStore = (data) => {
    axios
      .post("http://localhost:4000/store/add", data, {
        headers: { "x-token": sessionStorage.getItem("token") },
      })
      .then((res) => {
        const result = res.data;
        if (result["status"] === "success") {
          toast.success("Store Added");
          getAllStores();
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
    const sorted = [...filteredStores].sort((a, b) =>
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
    
    setFilteredStores(sorted);
  };
  useEffect(() => {
    getAllStores();
    getStoreOwner();
  }, []);

  return (
    <>
      <div className="row">
        <div className={isSidePanelVisible ? "col-8" : "col-12"}>
          <div className="card">
            <div className="card-header bg-primary d-flex justify-content-between text-white">
              <h3>Store List</h3>
              <form className="d-flex" role="search">
                <input
                  className="form-control"
                  type="search"
                  
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </form>
              <div
                className="d-flex align-items-center"
                
              >
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
                Add Store
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                {filteredStores.map((p) => (
                  <div
                    key={p.storeId}
                    className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center`}
                  >
                    <div className="card shadow" style={{ width: "18rem" }}>
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text btn-link">{p.email}</p>
                        <p className="card-text">
                          Avg rating : <b>{Math.floor(p.rating) || 0}</b>
                        </p>
                        <b className="card-text">{p.address}</b>
                        <br />
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
                      Add Store
                    </h2>

                    <form onSubmit={handleSubmit(onAddStore)}>
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
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="owner">
                          Select Owner
                        </label>
                        <select
                          id="owner"
                          className={`form-select ${
                            errors.ownerId ? "is-invalid" : ""
                          }`}
                          {...register("ownerId", { required: true })}
                        >
                          <option value="">Select Owner</option>
                          {owners.map((owner) => (
                            <option key={owner.userId} value={owner.userId}>
                              {owner.name}
                            </option>
                          ))}
                        </select>
                        {errors.ownerId && (
                          <div className="invalid-feedback">
                            Please select a store owner.
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

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        >
                          Add Store
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

export default AdminStores;
