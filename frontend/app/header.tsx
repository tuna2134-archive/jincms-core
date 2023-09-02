"use client";
import React from "react";
import Link from "next/link";
import { parseCookies, destroyCookie } from "nookies";
import { fetchUser, User } from "./_components/user";

interface GithubUser {
  login: string;
  avatar_url: string;
}

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
  }, [setUser, userid]);
  const handleLogout = () => {
    destroyCookie(null, "token");
    window.location.href = "/";
  };
  return (
    <div>
      <button onClick={openModal}>
        <img
          src={user?.avatar_url}
          className="w-10 h-10 rounded-full inline-block"
        />
      </button>
      {isOpen && (
        <div className="relative">
          <div className="absolute w-48 right-0 top-0 border rounded">
            <div className="bg-white">
              <div className="flex flex-col">
                <Link
                  href="/dashboard"
                  className="p-2 text-center border-b hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#fc0303] hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <p>Logout</p>
                </button>
              </div>
            </div>
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
        if (!userData) {
          return;
        }
        userData.login = userData.login.replaceAll('"', "");
        setUser(userData);
      })();
    }
  }, [setUser]);
  return (
    <header className="border-b">
      <div className="max-w-4xl w-full mx-auto h-16 items-center flex">
        <div className="flex">
          <Link className="text-4xl" href="/">
            jincms
          </Link>
        </div>
        <div className="ml-auto items-center flex">
          {user ? (
            <UserMenu userid={user?.login || ""} />
          ) : (
            <Link
              href="/login"
              className="bg-pink-500 text-white rounded px-4 py-1 text-2xl"
            >
              login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
