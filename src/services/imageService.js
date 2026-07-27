export async function uploadPhoto(file) {
  if (!file) {
    throw new Error("No image selected");
  }
  // formData is a container that we put data in
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();

  console.log("Cloudinary response:", result);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Failed to upload image");
  }

  return result.secure_url;
}
