export function highlightText(text, searchText) {
  if (!searchText.trim()) {
    return text;
  }

  const parts = text.split(
    new RegExp(`(${searchText})`, "gi")
  );

  return parts.map((part, index) =>
    part.toLowerCase() === searchText.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      part
    )
  );
}