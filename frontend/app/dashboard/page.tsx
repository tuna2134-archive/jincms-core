"use client";
import Link from "next/link";
import { parseCookies } from "nookies";
import React from "react";

interface Organization {
  id: string;
  name: string;
}

export default function Page() {
  const  [orgs, setOrgs] = React.useState<Organization[]>([]);
  const token = parseCookies().token;
  React.useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:8080/organizations", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      console.log(data);
      setOrgs(data);
    })();
  }, [setOrgs]);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h2 className="text-3xl text-bold">Select organizations</h2>
        <div className="mt-2 border rounded">
          {orgs.map((org) => (
            <div key={org.id} className="p-2 border">
              <Link href={"/dashboard/" + org.id}className="p-1 rounded hover:bg-slate-100 w-full h-full">
                {org.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button className="border rounded w-full p-2 text-green-500">Add</button>
        </div>
      </div>
    </div>
  )
}