"use client";
import React from "react";
import Link from 'next/link'
import { parseCookies } from "nookies";

export const Header = () => {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  React.useEffect(() => {
    const token = parseCookies().token;
    if (!token) {
      return;
    } else {
      (async () => {
        const userData = await fetchUser(token);
        if (userData !== undefined) {
          userData.login = userData?.login.replaceAll('"', '');
          setUser(userData);
        };
      })();
    }
  });
  return (
    <header className="border-b">
      <div className='max-w-4xl w-full mx-auto h-16 items-center flex'>
        <div className='flex'>
          <p className='text-4xl'>jincms</p>
        </div>
        <div className='ml-auto items-center flex'>
          {user ?
            <UserMenu userid={user?.login || ""} /> :
            <Link href='/login' className="bg-pink-500 text-white rounded px-4 py-1 text-2xl">login</Link>
          }
        </div>
      </div>
    </header>
  );
};
