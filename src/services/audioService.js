export async function uploadAudio(audioBlob) {
  if (!audioBlob) {
    throw new Error("No audio selected");
  }

  const formData = new FormData();

  formData.append("file", audioBlob);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/video/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();

  console.log("Cloudinary audio response:", result);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Failed to upload audio");
  }

  return result.secure_url;
}
