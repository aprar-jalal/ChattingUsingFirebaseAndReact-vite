import { useState } from "react";
import { searchUserByName } from "../services/userService";

export function useSearchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function search(name) {
    if (!name.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchUserByName(name);

      setUsers(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setUsers([]);
  }

  return {
    users,
    search,
    clearSearch,
    loading,
    error,
  };
}
