"use client";
import { useEffect,useRef } from "react";
import markup from "./admin-markup.json";
import { mountAdmin } from "./admin-controller";
export default function Admin() {
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(root.current) return mountAdmin(root.current);},[]);
  return <div className="v84-admin" ref={root} dangerouslySetInnerHTML={{__html:markup}} />;
}
