import { getFirebaseAuth } from "./firebase";
// Use for protected endpoints on the Node.js backend; verify the token with Firebase Admin there.
export async function authenticatedFetch(path: string, init: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("API ще не налаштовано");
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("Очікується відносний шлях API");
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("Увійдіть в обліковий запис");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${await user.getIdToken()}`);
  return fetch(`${base.replace(/\/$/, "")}${path}`, { ...init, headers });
}
