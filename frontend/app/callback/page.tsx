"use client";
import React from "react";
import { setCookie } from 'nookies'

export default function Page() {
  React.useEffect(() => {
    const fetchToken = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      console.log(code);
      const res = await fetch(`http://localhost:8080/users/callback?code=${code}`);
      const data = await res.json();
      setCookie(null, 'token', data.token, {
        maxAge: 30 * 24 * 60 * 60,
      });
      window.location.href = '/';
    };
    fetchToken();
  });
  return (
    <p>ページ転移します。</p>
  );
};