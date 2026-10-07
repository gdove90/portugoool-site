"use client";
import { useEffect, useState } from "react";
import { Brand } from "./Brand";
export default function SignIn() {
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  useEffect(()=>{ let active=true; fetch("/api/admin/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"refresh"})}).then(r=>{if(r.ok && active) window.location.replace("/admin");}).catch(()=>{}); return ()=>{active=false;}; },[]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();setBusy(true);setError("");
    try { const result=await fetch("/api/admin/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})}); const data=await result.json(); if(!result.ok) throw new Error(data.error); window.location.replace("/admin"); }
    catch(e) { setError(e instanceof Error?e.message:"Could not sign in.");setBusy(false); }
  }
  return <div className="v84"><div className="owner-signin"><Brand /><h1>Private workspace.</h1><form onSubmit={submit}><label htmlFor="owner-email">Email</label><input id="owner-email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /><label htmlFor="owner-password">Password</label><input id="owner-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /><button className="btn" disabled={busy}>{busy?"Signing in...":"Sign in"}</button><p role="alert">{error}</p></form></div></div>;
}
