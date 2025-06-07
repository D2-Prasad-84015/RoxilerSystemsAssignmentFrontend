import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [hover, setHover] = useState({});
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");

  const decoded = jwtDecode(sessionStorage.getItem("token"));
  const userId = decoded.id;

  const getAllStores = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/store/get`);
      const result = res.data;
      if (result.status === "success") {
        const stores = result.data;
        const storesWithRatings = await Promise.all(
          stores.map(async (store) => {
            try {
              const ratingRes = await axios.get(
                `http://localhost:4000/rating/get/${store.storeId}`
              );
              const ratingData = ratingRes.data;

              if (ratingData.status === "success") {
                return {
                  ...store,
                  userRating: ratingData.data,
                  currentUserRating:
                    ratingData.data.find((r) => r.userId === userId)?.rating ||
                    0,
                };
              } else {
                toast.error(`Rating fetch failed for store ${store.storeId}`);
                return { ...store, userRating: [], currentUserRating: 0 };
              }
            } catch (err) {
              toast.error(`Error fetching rating for store ${store.storeId}`);
              return { ...store, userRating: [], currentUserRating: 0 };
            }
          })
        );
        const initialRatings = {};
        storesWithRatings.forEach((store) => {
          initialRatings[store.storeId] = store.currentUserRating;
        });
        setRatings(initialRatings);
        setStores(storesWithRatings);
        setFilteredStores(storesWithRatings);
      } else {
        toast.error("Error while fetching stores");
      }
    } catch (err) {
      toast.error("Network error while fetching stores");
      console.error(err);
    }
  };

  const handleSubmit = (storeId, rating) => {
    axios
      .post(
        `http://localhost:4000/rating/submit`,
        { storeId, rating },
        { headers: { "x-token": sessionStorage.getItem("token") } }
      )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success("Rating submitted");
          setRatings((prev) => ({ ...prev, [storeId]: rating }));
          getAllStores();
        } else {
          toast.error("Failed to submit rating");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error submitting rating");
      });
  };

  const handleMouseEnter = (storeId, value) => {
    setHover((prev) => ({ ...prev, [storeId]: value }));
  };

  const handleMouseLeave = (storeId) => {
    setHover((prev) => ({ ...prev, [storeId]: 0 }));
  };

  const openRatingsModal = (ratingsList) => {
    setSelectedRatings(ratingsList);
    setIsRatingsModalOpen(true);
  };

  const closeRatingsModal = () => {
    setIsRatingsModalOpen(false);
    setSelectedRatings([]);
  };
  const handleSearch = (e) => {
    const values = e.target.value.toLowerCase();
    setSearchTerm(values);

    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(values) ||
        store.address.toLowerCase().includes(values)
    );

    setFilteredStores(filtered);
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
  }, []);

  return (
    <>
      <div className="container mt-4 d-flex flex-column">
        <h3 className="text-center mb-4">All Stores</h3>
        <form className="d-flex justify-content-between" role="search">
          <input
            style={{ width: "300px" }}
            className="form-control mb-3"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={handleSearch}
          />
          <div className="d-flex align-items-center mb-3">
            <label className="form-label ">Order By:</label>
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
        </form>

        <div className="row flex-grow-1 gx-4 gy-4 justify-content-center mb-3">
          {filteredStores && filteredStores.length > 0 ? (
            filteredStores.map((p) => (
              <div
                key={p.storeId}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
              >
                <div className="card w-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text" style={{ fontSize: "0.9rem" }}>
                      {p.address}
                    </p>
                    <span>
                      Overall Rating -
                      <b className="card-text"> {Math.floor(p.rating) || 0}</b>
                    </span>
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ gap: "4px", fontSize: "24px" }}
                    >
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        const hoverRate = hover[p.storeId] || 0;
                        const selectedRating = ratings[p.storeId] || 0;

                        return (
                          <span
                            key={index}
                            style={{
                              cursor: "pointer",
                              color:
                                starValue <= (selectedRating || hoverRate)
                                  ? "#ffc107"
                                  : "#e4e5e9",
                            }}
                            onClick={() => handleSubmit(p.storeId, starValue)}
                            onMouseEnter={() =>
                              handleMouseEnter(p.storeId, starValue)
                            }
                            onMouseLeave={() => handleMouseLeave(p.storeId)}
                          >
                            ★
                          </span>
                        );
                      })}
                    </div>

                    <p className="mt-2">
                      Rated by <b>{p.userRating.length}</b> users
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm mt-auto"
                      onClick={() => openRatingsModal(p.userRating)}
                    >
                      View Ratings
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No result found</p>
          )}
        </div>
      </div>
      {isRatingsModalOpen && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center">User Ratings</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeRatingsModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedRatings.length > 0 ? (
                  selectedRatings.map((ur, index) => (
                    <p key={index}>
                      <b>{ur.name}</b>: {ur.rating}
                    </p>
                  ))
                ) : (
                  <p>No ratings submitted yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserStores;
