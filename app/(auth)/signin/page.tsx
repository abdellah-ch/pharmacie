"use client";

import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const IdRef = useRef<HTMLInputElement>(null);

  const PasswordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const handleSubmit = async () => {
    const userId = IdRef.current?.value;
    const password = PasswordRef.current?.value;
    const result = await signIn("credentials", {
      userId,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
    } else {
      alert("Échec de la connexion");
    }
  };

  return (
    <div className="bg-[#f7f7fe] h-[100vh] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            <img className="" width={60} src="/images/logo.png" alt="Logo" />
          </div>

          <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
            Connectez-vous
          </p>

          <div className="w-full mt-4">
            <input
              ref={IdRef}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="identifiant "
              aria-label="identifiant"
              autoComplete="off"
            />
          </div>

          <div className="w-full mt-4">
            <input
              ref={PasswordRef}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="password"
              autoComplete="off"
              placeholder="Mot de passe"
              aria-label="Mot de passe"
            />
          </div>

          <div className="flex items-center justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
