export const fetchWithAuth = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};