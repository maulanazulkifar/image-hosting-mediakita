const PostImage = async (data) => {
  try {
    const response = await fetch(
      "https://odd-rain-b1a7.maulanazulkifar.workers.dev/",
      {
        method: "POST",
        body: data,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

export default PostImage;
