"use client";

export interface User {
  name: string;
  login: string;
}

export async function fetchUser(token: string): Promise<User | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
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
