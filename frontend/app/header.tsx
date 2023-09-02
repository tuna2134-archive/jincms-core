"use client";
import React from "react";
import Link from 'next/link'
import { parseCookies } from "nookies";
import { fetchUser, User } from "./_components/user";

interface GithubUser {
  login: string;
  avatar_url: string;
};

const UserMenu = ({ userid }: { userid: string }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<GithubUser | undefined>(undefined);
  const openModal = () => setOpen(!isOpen);
  React.useEffect(() => {
    (async () => {
      const res = await fetch(`https://api.github.com/users/${userid}`);
      const data = await res.json();
      console.log(data);
      setUser(data);
    })();
  }, [setUser]);
  return (
    <div>
      <button onClick={openModal}>
        <img src={user?.avatar_url} className="w-10 h-10 rounded-full inline-block" />
      </button>
      {isOpen &&
        <div className="absolute border w-48 rounded">
          <div className="bg-white">
            <div className="flex flex-col">
              <Link href="/dashboard" className="p-2 text-center border-b">Dashboard</Link>
              <button className="p-2">
                <p className="text-[#fc0303]">Logout</p>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
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
        if (!userData) {
          return;
        }
        userData.login = userData.login.replaceAll('"', '');
        setUser(userData);
      })();
    }
  });
  return (
    <header className="border-b">
      <div className='max-w-4xl w-full mx-auto h-16 items-center flex'>
        <div className='flex'>
          <Link className='text-4xl' href="/">jincms</Link>
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
