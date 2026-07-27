import React from "react";
import styles from "./SignUp.module.css";
import { auth, db } from "../../config/firebase-config";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { uploadFile } from "../../services/uploadFile";function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
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

      console.log("Created user:", createdUser);

      const picUrl = await uploadFile(data.Pic?.[0],"image");
      console.log("Photo URL:", picUrl);
      console.log("Type:", typeof picUrl);
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

      console.log("User added to firestore", createdUser);

      navigate("/Chat");
    } catch (error) {
      if (createdUser) {
        try {
          await deleteUser(createdUser);
          console.log("User deleted because signup failed");
        } catch (deleteError) {
          console.log("Failed to delete user:", deleteError.message);
        }
      }

      console.log(error.message);
      alert(error.message);
    }
  };
  return (
    <div className={styles.Container}>
      <div className={styles.subContainer}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="User@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
            />

            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Phone Number"
              {...register("number", {
                required: "Number is required",
              })}
            />

            {errors.number && (
              <p className={styles.errorMessage}>{errors.number.message}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="file"
              className={styles.fileInput}
              accept="image/*"
              {...register("Pic", {
                required: "Profile picture is required",
              })}
            />

            {errors.Pic && (
              <p className={styles.errorMessage}>{errors.Pic.message}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
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

            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
