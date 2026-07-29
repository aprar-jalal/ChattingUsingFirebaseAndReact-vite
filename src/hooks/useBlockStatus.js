import { useEffect, useState } from "react";
import { subscribeToBlockStatus } from "../services/userService";

export function useBlockStatus(currentUserId, otherUserId) {
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [blockedMe, setBlockedMe] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setBlockedByMe(false);
      setBlockedMe(false);
      setLoading(false);

      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToBlockStatus(
      currentUserId,
      otherUserId,
      (status) => {
        setBlockedByMe(status.blockedByMe);
        setBlockedMe(status.blockedMe);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentUserId, otherUserId]);
  return {
    blockedByMe,
    blockedMe,
    loading,
  };
}