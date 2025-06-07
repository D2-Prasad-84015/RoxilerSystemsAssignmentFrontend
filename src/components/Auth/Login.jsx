import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = (data) => {
   
    axios.post(`http://localhost:4000/auth/signin`, data).then((res) => {
     
      const result = res.data;  
      if (result["status"] === "success") {
        const token = result["data"];
        toast.success("Login successfully!");
        sessionStorage["token"] = token;
         navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    });
  };

  return (
    <>
      <section className="mt-2">
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-5">Login</h2>

                    <form onSubmit={handleSubmit(onLogin)}>
                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" for="form3Example1cg">
                          Email
                        </label>
                        <input
                          type="text"
                          id="form3Example1cg"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                             Email Address is required.
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
                          })}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            Password is required
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
                          Login
                        </button>
                      </div>

                      <p className="text-center text-muted mt-5 mb-0">
                        Don't have an account?{" "}
                        <Link to={"/signup"} className="fw-bold text-body">
                          <u>Register here</u>
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
