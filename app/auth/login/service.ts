
export async function loginUser(studentId: string, password: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-type": "web",
        },
        body: JSON.stringify({
          id: studentId,
          password,
        }),
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}