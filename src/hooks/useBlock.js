import { useState } from "react";
import {
  blockUser,
  unBlockUser,
} from "../services/userService";
import { toast } from "react-toastify";

export function useBlockUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function block(currentUserId, userIdToBlock) {
    setLoading(true);
    setError(null);
    try {
      await blockUser(currentUserId, userIdToBlock);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function unblock(currentUserId, userIdToUnblock) {
    setLoading(true);
    setError(null);
    try {
      await unBlockUser(currentUserId, userIdToUnblock);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    block,
    unblock,
    loading,
    error,
  };
}