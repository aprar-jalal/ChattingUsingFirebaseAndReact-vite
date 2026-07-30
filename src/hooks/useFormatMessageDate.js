export function getDate(timestamp) {
  if (!timestamp) return null;
  //if the firebase date has toDate do this timestamp.toDate() if not create one  new Date(timestamp);
  return timestamp?.toDate
    ? timestamp.toDate()
    : new Date(timestamp);
}

export function formatMessageDate(timestamp) {
  const date = getDate(timestamp);

  if (!date) return "";

  const now = new Date();
 // gets today's date 
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  //th result is in millseconds 
  const diffTime = today - messageDay;

  //converts the time into days 
  const diffDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays === 2) {
    return "2 days ago";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);

    return weeks === 1
      ? "Last week"
      : `${weeks} weeks ago`;
  }

  if (diffDays < 60) {
    return "Last month";
  }

  const months = Math.floor(diffDays / 30);

  return `${months} months ago`;
}

export function formatFullDate(timestamp) {
  const date = getDate(timestamp);

  if (!date) return "";
//converts the Date into readble string 
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

