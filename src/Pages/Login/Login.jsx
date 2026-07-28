import React from "react";
import styles from "./Login.module.css";
import { auth } from "../../config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      console.log("Logged in:", userCredential.user);

      navigate("/Chat");
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const onClick = () => {
    navigate("/signUp");
  };

  return (
    <div className={styles.Container}>
      <div className={styles.backgroundCircle}></div>
      <div className={styles.backgroundCircleTwo}></div>

      <div className={styles.subContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <i className="fa-solid fa-comments"></i>
          </div>

          <h1>Welcome Back</h1>
          <p>Login to continue chatting with your friends</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <label>Email</label>

            <div className={styles.inputWrapper}>
              <i className="fa-regular fa-envelope"></i>

              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
            </div>

            {errors.email && (
              <p className={styles.errorMessage}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>

            <div className={styles.inputWrapper}>
              <i className="fa-solid fa-lock"></i>

              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
            </div>

            {errors.password && (
              <p className={styles.errorMessage}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button className={styles.loginButton} type="submit">
            Login
            <i className="fa-solid fa-arrow-right"></i>
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.signupText}>
            <span>Don't have an account?</span>

            <button
              type="button"
              className={styles.signupButton}
              onClick={onClick}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

