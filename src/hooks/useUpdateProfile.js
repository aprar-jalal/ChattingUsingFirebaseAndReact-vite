import { useState } from "react";
import { UpdateUser } from "../services/userService";
import { toast } from "react-toastify";
export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateProfile(userId, data) {
    setLoading(true);
    setError(null);

    try {
      await UpdateUser(userId, {
        name: data.name,
        number: data.number,
        photoURL: data.photoURL,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    updateProfile,
    loading,
    error,
  };
}
