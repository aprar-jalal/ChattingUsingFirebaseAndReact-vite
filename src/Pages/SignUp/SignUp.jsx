import React from "react";
import styles from "./SignUp.module.css";
import { auth, db } from "../../config/firebase-config";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { uploadFile } from "../../services/uploadFile";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    let createdUser = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      createdUser = userCredential.user;

      const picUrl = await uploadFile(data.Pic?.[0], "image");

      await setDoc(doc(db, "users", createdUser.uid), {
        uid: createdUser.uid,
        Name: data.name,
        searchName: data.name.toLowerCase(),
        email: createdUser.email,
        number: data.number,
        photoURL: picUrl,
        isOnline: false,
        verified: false,
      });

      navigate("/Chat");
    } catch (error) {
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch (deleteError) {
          console.log("Failed to delete user:", deleteError.message);
        }
      }

      console.log(error.message);
      alert(error.message);
    }
  };

  return (
    <div className={styles.pageHeight}>
      <div className={styles.Container}>
        <div className={styles.backgroundCircle}></div>
        <div className={styles.backgroundCircleTwo}></div>

        <div className={styles.subContainer}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <i className="fa-solid fa-user-plus"></i>
            </div>

            <h1>Create Account</h1>
            <p>Join us and start chatting with your friends</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <label>Email</label>

              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-envelope"></i>

                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email",
                    },
                  })}
                />
              </div>

              {errors.email && (
                <p className={styles.errorMessage}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Name</label>

              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-user"></i>

                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </div>

              {errors.name && (
                <p className={styles.errorMessage}>{errors.name.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>

              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-phone"></i>

                <input
                  type="text"
                  placeholder="Enter your phone number"
                  {...register("number", {
                    required: "Number is required",
                  })}
                />
              </div>

              {errors.number && (
                <p className={styles.errorMessage}>{errors.number.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Profile Picture</label>

              <div className={styles.fileWrapper}>
                <i className="fa-solid fa-image"></i>

                <input
                  type="file"
                  accept="image/*"
                  {...register("Pic", {
                    required: "Profile picture is required",
                  })}
                />
              </div>

              {errors.Pic && (
                <p className={styles.errorMessage}>{errors.Pic.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>

              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-lock"></i>

                <input
                  type="password"
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Too short, at least 6 characters",
                    },
                    maxLength: {
                      value: 12,
                      message: "Too long, at most 12 characters",
                    },
                  })}
                />
              </div>

              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className={styles.signupButton}>
              <span>Create Account</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <div className={styles.loginText}>
              <span>Already have an account?</span>

              <button
                type="button"
                className={styles.loginButton}
                onClick={() => navigate("/")}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
