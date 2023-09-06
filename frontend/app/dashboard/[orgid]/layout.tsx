"use client";
import Link from "next/link";
import { parseCookies } from "nookies";
import React from "react";

interface Setting {
  id: string;
  name: string;
}

export default function Page({
  params,
  children,
}: {
  params: { orgid: string };
  children: React.ReactNode;
}) {
  const settings: Setting[] = [
    {
      id: "articles",
      name: "Articles",
    },
  ];
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="w-full flex min-h-screen">
        <div className="w-1/4 border-r min-h-screen overscroll-y-scroll">
          {settings.map((setting) => (
            <div key={setting.id} className="py-4 px-6 border-b">
              <Link href={setting.id} className="text-2xl">
                {setting.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="w-3/4 overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto mt-16">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
