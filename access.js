// Convenience lock only. Public client-side code cannot enforce server authorization.
// This digest avoids storing the literal password; weak passwords remain guessable.
const digest='1dd666c6fda10e9549d1fba9fabbd1df08fe8e3209a3db1ffe8bc1231d1d07f1';
let unlocked=false;
export const isUnlocked=()=>unlocked;
export const lock=()=>{unlocked=false;};
export async function unlock(user,password){
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(user+':'+password));
  unlocked=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')===digest;
  return unlocked;
}
