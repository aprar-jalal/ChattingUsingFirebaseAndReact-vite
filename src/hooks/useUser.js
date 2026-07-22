import { useEffect, useState } from "react";
import { subscribeToUser } from "../services/userService";

export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUser(
      userId,

      (data) => {
        setUser(data);
        setLoading(false);
      },

      (error) => {
        setError(error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  return {
    user,
    loading,
    error,
  };
}
