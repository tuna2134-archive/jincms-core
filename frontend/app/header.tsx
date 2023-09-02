"use client";
import React from "react";
import Link from 'next/link'
import { parseCookies } from "nookies";
import { fetchUser, User } from "./_components/user";

const UserMenu = ({ userid }: { userid: string }) => {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | undefined>(undefined);
  React.useEffect(() => {
    (async () => {
      const token = parseCookies().token;
      if (!token) {
        return;
      } else {
        const userData = await fetchUser(token);
        setUser(userData);
      }
    })();
  }, [setUser]);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-full h-12 w-12 bg-gray-200 flex items-center justify-center">
        <p className="text-2xl">{userid[0]}</p>
      </button>
      {open && (
        <div className="absolute right-0 top-12 border rounded bg-white">
          <div className="p-2 border-b">
            <p className="text-2xl">{userid}</p>
          </div>
          <div className="p-2">
            <Link href="/logout" className="text-2xl">Logout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  React.useEffect(() => {
    const token = parseCookies().token;
    if (!token) {
      return;
    } else {
      (async () => {
        const userData = await fetchUser(token);
        setUser(userData);
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
