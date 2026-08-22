/**
 * Development-only login prefill.
 *
 * The values are read from `.env.local`, which is covered by the `*.local` rule
 * in .gitignore, so real credentials never get committed the way they would in
 * the tracked `.env`. In a production build `import.meta.env.DEV` is false and
 * this always returns empty strings, so the sign-in form ships blank even if
 * the variables happen to be defined at build time.
 */
export interface DevCredentials {
  username: string;
  password: string;
}

export const getDevCredentials = (): DevCredentials => {
  if (!import.meta.env.DEV) {
    return { username: "", password: "" };
  }

  return {
    username: import.meta.env.VITE_DEV_USERNAME ?? "",
    password: import.meta.env.VITE_DEV_PASSWORD ?? "",
  };
};
