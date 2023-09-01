"use client"

export interface User {
  name: string;
}

export async function fetchUser(token: string): Promise<User> {
  const res = await fetch("http://localhost:8080/users/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await res.json();
};