import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';


const Register = () => {
   const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onRegister = (data) => {
    
    axios.post(`http://localhost:4000/auth/signup`,data)
    .then((res)=>{
      
      const result=res.data;
       if (result["status"] === "success") {
                toast.success("Register successfully");
                navigate("/signin");
              } else {
                toast.error("error while register");
              }
      
    })
  };

  return (
    <section className="mt-2">
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Create an account
                  </h2>

                  <form onSubmit={handleSubmit(onRegister)}>
                    <div
                      data-mdb-input-init
                      className="form-outline mb-4 "
                    >
                      <div className="me-2">
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
                          Password must be 8–16 characters, include an uppercase
                          letter and a special character.
                        </div>
                      )}
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <label className="form-label" for="form3Example3cg">
                        Address
                      </label>
                      <textarea
                        type="text"
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
                        Sign Up
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Have already an account?{" "}
                      <Link to={"/signin"} className="fw-bold text-body">
                        <u>Login here</u>
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
  );
};

export default Register;
