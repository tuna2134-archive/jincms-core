"use client";
import React from "react";
import Link from 'next/link'
import { parseCookies } from "nookies";

export const Header = () => {
  const [isLogin, setLogin] = React.useState(false);
  React.useEffect(() => {
    const token = parseCookies().token;
    console.log(token);
    if (!token) {
      return;
    } else {
      setLogin(true);
    }
  }, [setLogin]);
  return (
    <header className="border-b">
      <div className='max-w-4xl w-full mx-auto h-16 items-center flex'>
        <div className='flex'>
          <p className='text-4xl'>jincms</p>
        </div>
        <div className='ml-auto items-center flex'>
          {isLogin ?
            <Link href='/dashboard' className="bg-pink-500 text-white rounded px-4 py-1 text-2xl">dashboard</Link> :
            <Link href='/login' className="bg-pink-500 text-white rounded px-4 py-1 text-2xl">login</Link>
          }
        </div>
      </div>
    </header>
  );
};
