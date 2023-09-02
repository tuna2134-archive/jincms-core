import Link from "next/link";
import { cookies } from "next/headers";
import React from "react";

interface Organization {
  id: string;
  name: string;
}

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  console.log(token);
  if (token === undefined) {
    return <p>ログインし直してください</p>
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/organizations`,
    {
      headers: {
        Authorization: "Bearer " + token.value,
      },
    },
  );
  console.log(res);
  const data: Organization[] = await res.json();
  return (
    <div className="bg-pink-50 w-full flex justify-center items-center min-h-screen">
      <div>
        <h2 className="text-3xl text-bold">Select organizations</h2>
        <div className="mt-2 border rounded">
          {data.map((org) => (
            <div key={org.id} className="p-2 hover:bg-slate-50">
              <Link
                href={"/dashboard/" + org.id}
                className="p-1 hover:bg-slate-100 w-full h-full"
              >
                {org.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button className="border rounded hover:bg-slate-100 w-full p-2 text-green-500 flex space-w-4 justify-center">
            <span className="material-symbols-outlined">add</span>
            <p>Add</p>
          </button>
        </div>
      </div>
    </div>
  );
}
