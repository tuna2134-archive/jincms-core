"use client";

export interface User {
  name: string;
  login: string;
}

export async function fetchUser(token: string): Promise<User | undefined> {
  const res = await fetch("http://localhost:8080/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });
  if (!res.ok) {
    return undefined;
  }
  return await res.json();
}
