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
  } = useForm({ mode: "onChange" });

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
      <div className={styles.subContainer}>
        <h1>Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.buttonContainer}>
          <button type="submit">Login</button>
          <button onClick={onClick}>SignUp</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
