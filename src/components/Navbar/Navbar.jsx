import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  let role = null;
  let isLoggedIn = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      isLoggedIn = true;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    navigate("/signin");
    sessionStorage.clear();
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/dashboard"}>
            Store App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={"/dashboard"}
                    >
                      Dashboard
                    </Link>
                  </li>
                  {role === "admin" && (
                    <>
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          aria-current="page"
                          to={"/admin/stores"}
                        >
                          Stores
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          aria-current="page"
                          to={"/admin/users"}
                        >
                          Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Profile
                    </a>
                    <ul className="dropdown-menu">
                      {!(role === "admin") && (
                        <>
                          <li>
                            <Link className="dropdown-item" to={"/password/update"}>
                              Change Password
                            </Link>
                          </li>
                        </>
                      )}

                      <li>
                        <button
                          className="dropdown-item btn"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              {!token && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      classNameName="btn"
                      aria-current="page"
                      to={"/signin"}
                    >
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      classNameName="btn "
                      aria-current="page"
                      to={"/signup"}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
