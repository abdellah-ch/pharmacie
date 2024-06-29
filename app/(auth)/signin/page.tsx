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
    <div className="bg-blue-200 text-white h-[100vh] flex justify-center items-center">
      <div className=" bg-slate-800 border-slate-400 rounded-md shadow-lg  backdrop-blur-sm bg-opacity-30 relative p-8">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            <img className="" width={60} src="/images/logo.png" alt="Logo" />
          </div>

          <p className="mt-1 text-center ">Connectez-vous</p>

          <div className="relative my-4">
            <input
              ref={IdRef}
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              type="text"
              aria-label="identifiant"
              autoComplete="off"
              placeholder=" "
            />
            <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Identifiant
            </label>
          </div>

          <div className="relative my-4">
            <input
              ref={PasswordRef}
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              type="password"
              autoComplete="off"
              aria-label="Mot de passe"
              placeholder=" "
            />
            <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Mot de passe
            </label>
          </div>

          <div className="flex items-center justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2"
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
