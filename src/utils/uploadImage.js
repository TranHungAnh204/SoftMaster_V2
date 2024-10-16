const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "kjdtvpwj");

  const data = await (
    await fetch("https://api.cloudinary.com/v1_1/dlvkpriex/image/upload", {
      method: "POST",
      body: formData,
    })
  ).json();

  return data.secure_url;
};

export default uploadImage;
