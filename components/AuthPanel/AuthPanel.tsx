"use client";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseConfigured, getFirebaseAuth } from "@/lib/firebase";
import styles from "./AuthPanel.module.css";
export default function AuthPanel({ user }: { user: User | null }) {
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  async function run(action: () => Promise<unknown>, success = "") {
    setBusy(true);
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (error) {
      const code = (error as { code?: string }).code;
      setMessage(
        code === "auth/invalid-credential"
          ? "Перевірте email і пароль."
          : code === "auth/email-already-in-use"
            ? "Цей email уже зареєстровано. Спробуйте увійти."
            : code === "auth/popup-closed-by-user"
              ? "Вікно входу закрито. Спробуйте ще раз."
              : code === "auth/too-many-requests"
                ? "Забагато спроб. Спробуйте пізніше."
                : "Не вдалося виконати дію. Перевірте з’єднання та налаштування входу.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!firebaseConfigured)
    return (
      <div className={styles.panel}>
        <p>Вхід незабаром буде доступний.</p>
        <p>Поки ви можете вибрати прикраси та зв’язатися з нами в Instagram.</p>
        <a
          href="https://www.instagram.com/jeverllyb/"
          target="_blank"
          rel="noreferrer"
        >
          Написати Jeverly Butique ↗
        </a>
      </div>
    );
  if (user)
    return (
      <div className={styles.panel}>
        <p>
          Ви увійшли як <strong>{user.email || user.displayName}</strong>
        </p>
        <button
          disabled={busy}
          onClick={() => run(() => signOut(getFirebaseAuth()))}
        >
          Вийти з облікового запису
        </button>
        <p role="status">{message}</p>
      </div>
    );
  return (
    <div className={styles.panel}>
      <p>
        {register
          ? "Створіть свій обліковий запис Jeverly Butique."
          : "Ласкаво просимо до вашого світу Jeverly Butique."}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const password = String(data.get("password"));
          void run(() =>
            register
              ? createUserWithEmailAndPassword(
                  getFirebaseAuth(),
                  email,
                  password,
                )
              : signInWithEmailAndPassword(getFirebaseAuth(), email, password),
          );
        }}
      >
        <label>
          Email
          <input
            autoComplete="email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete={register ? "new-password" : "current-password"}
          />
        </label>
        <button disabled={busy} type="submit">
          {busy
            ? "Зачекайте…"
            : register
              ? "Створити обліковий запис"
              : "Увійти"}
        </button>
      </form>
      <button
        className={styles.secondary}
        disabled={busy}
        onClick={() =>
          run(() =>
            signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider()),
          )
        }
      >
        Продовжити з Google
      </button>
      <button
        className={styles.link}
        disabled={busy}
        onClick={() => {
          setRegister(!register);
          setMessage("");
        }}
      >
        {register
          ? "Уже маєте обліковий запис? Увійти"
          : "Створити обліковий запис"}
      </button>
      {!register && (
        <button
          className={styles.link}
          disabled={busy}
          onClick={() => {
            if (!email) {
              setMessage("Введіть email для відновлення пароля.");
              return;
            }
            void run(
              () => sendPasswordResetEmail(getFirebaseAuth(), email),
              "Якщо обліковий запис існує, лист для відновлення надіслано.",
            );
          }}
        >
          Забули пароль?
        </button>
      )}
      <p role="status">{message}</p>
    </div>
  );
}
