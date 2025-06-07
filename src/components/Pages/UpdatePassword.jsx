import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate=useNavigate();
  const onUpdatePassword = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.warn("New Password and Confirm Password must match");
    } else {
      axios
        .post(`http://localhost:4000/user/password/update`, data, {
          headers: { "x-token": sessionStorage.getItem("token") },
        })
        .then((res) => {
          const result = res.data;
          if (result["status"] === "success") {
            toast.success("Password updated");
            navigate('/dashboard')
          } else {
            toast.error(result["error"]);
          }
        });
    }
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
                    <h2 className="text-uppercase text-center mb-5">
                      Update Password
                    </h2>

                    <form onSubmit={handleSubmit(onUpdatePassword)}>
                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" for="form3Example4cg">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="form3Example4cg"
                          className={`form-control ${
                            errors.currentPassword ? "is-invalid" : ""
                          }`}
                          {...register("currentPassword", {
                            required: true,
                          })}
                        />
                        {errors.currentPassword && (
                          <div className="invalid-feedback">
                            Password is required
                          </div>
                        )}
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" for="form3Example4cg">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="form3Example4cg"
                          className={`form-control ${
                            errors.newPassword ? "is-invalid" : ""
                          }`}
                          {...register("newPassword", {
                            required: true,
                            minLength: 8,
                            maxLength: 16,
                            pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])/,
                          })}
                        />
                        {errors.newPassword && (
                          <div className="invalid-feedback">
                            Password must be 8–16 characters, include an
                            uppercase letter and a special character.
                          </div>
                        )}
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label" for="form3Example4cg">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="form3Example4cg"
                          className={`form-control ${
                            errors.confirmPassword ? "is-invalid" : ""
                          }`}
                          {...register("confirmPassword", {
                            required: true,
                            minLength: 8,
                            maxLength: 16,
                            pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])/,
                          })}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">
                            Password must be 8–16 characters, include an
                            uppercase letter and a special character.
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
                          Update
                        </button>
                      </div>
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

export default UpdatePassword;
