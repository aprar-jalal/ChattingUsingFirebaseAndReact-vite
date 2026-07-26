import React, { useEffect, useRef, useState } from "react";
import styles from "./Settings.module.css";
import avatar from "../../assets/avatar.webp";
import { useUser } from "../../hooks/useUser";
import { uploadPhoto } from "../../services/imageService";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";

function Settings({ userId }) {
  const { user, loading: userLoading, error: userError } = useUser(userId);
  const [preview, setPreview] = useState(user?.photoURL);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const {
    updateProfile,
    loading: UpdatingUserLoading,
    error: UpdatingUserError,
  } = useUpdateProfile();
 
useEffect(() => {
  if (user) {
    setName(user.Name || "");
    setNumber(user.number || "");
    setPreview(user.photoURL || avatar);
  }
}, [user]);

  async function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = await uploadPhoto(file);
    setPreview(imageUrl);
  }

  async function saveData() {
    await updateProfile(userId, {
      name,
      number,
      photoURL: preview,
    });
    
  }
  if (userLoading || UpdatingUserLoading) {
    return <p>Loading...</p>;
  }

  if (userError || UpdatingUserError) {
    return <p>{error.message}</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className={styles.settings}>
      <h2>Settings</h2>
      <div className={styles.profileImageContainer}>
        <img
          src={preview}
          alt="Profile"
          className={styles.profileImage}
        />

        <label className={styles.button}>
          <i className="fa-solid fa-camera"></i>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>
      </div>

      <div className={styles.field}>
        <label>Name</label>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="button">
            <i className="fa-solid fa-pen"></i>
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label>Phone Number</label>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <button type="button">
            <i className="fa-solid fa-pen"></i>
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label>Email</label>

        <div className={styles.inputWrapper}>
          <input type="email" value={user.email || ""} disabled />
        </div>
      </div>
      <div>
        <button onClick={saveData} className={styles.saveButton}>Save</button>
      </div>
      
    </div>
  );
}

export default Settings;
