export async function uploadFile(file, type) {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/${type}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  console.log("Cloudinary response:", result);

  if (!response.ok) {
    throw new Error(
      result?.error?.message || "Failed to upload file"
    );
  }

  return result.secure_url;
}