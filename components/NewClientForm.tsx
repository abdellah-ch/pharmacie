"use client";
import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import "@uploadthing/react/styles.css";
import { createClient } from "@/lib/Client";

interface FormData {
  nom: string;
  nomSociete?: string;
  email: string;
  telephone?: string;
  adresse?: string;
  codePostal?: number; // Adjusted to be a number
  Region?: string;
}
const NewClientForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({});

  // const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      console.log(data);
      data.codePostal = Number(data.codePostal);
      // console.log(errors);
      await createClient(data);
      alert("inserted");
      // router.push("/clients");
    } catch (error) {
      console.error("Failed to create client", error);
    }
  };

  return (
    <div className="example flex flex-col h-[73vh] w-full overflow-y-scroll">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-[#f7f7fe] flex gap-20 p-6">
          <div className="w-[45%]">
            <div className="flex flex-col gap-5">
              <div className="flex gap-20 items-center">
                <label className="text-red-500 w-[30%] text-xs">
                  Nom d'affichage du client*
                </label>
                <Input
                  type="text"
                  className="outline-none focus:none"
                  autoComplete="off"
                  {...register("nom")}
                />
                {errors.nom && (
                  <p className="text-red-500">{errors.nom.message}</p>
                )}
              </div>

              <div className="flex gap-20 items-center">
                <label className="text-[#212529] w-[30%] text-xs">
                  Nom de la société
                </label>
                <Input
                  type="text"
                  className="outline-none focus:none"
                  autoComplete="off"
                  {...register("nomSociete")}
                />
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Email du Client
                </label>
                <Input type="email" autoComplete="off" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Téléphone du client
                </label>
                <Input
                  type="text"
                  autoComplete="off"
                  {...register("telephone")}
                />
              </div>

              <div className="flex gap-20 items-center">
                <div className="w-full"></div>
              </div>
            </div>
          </div>
          <div className="w-[25%] text-black flex flex-col gap-14 items-left "></div>
        </div>

        <div className="bg-white p-6 flex gap-20">
          <div className="w-[45%]">
            <h1>Adresse Client</h1>
            <div className="flex flex-col gap-5">
              <div className="flex gap-20 items-center">
                <label className="text-[#212529] w-[30%] text-xs">
                  Pays / Région
                </label>
                <div className="w-full flex items-center border border-zinc-300 rounded-lg">
                  <Input
                    type="text"
                    className="outline-none border-none focus:ring-0"
                    autoComplete="off"
                    {...register("Region")}
                  />
                </div>
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Adresse
                </label>
                <Textarea autoComplete="off" {...register("adresse")} />
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Code postal
                </label>
                <Input
                  type="number"
                  autoComplete="off"
                  {...register("codePostal")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[100%] p-6 bg-white absolute bottom-0 h-[10vh] flex gap-4 items-center shadow-lg shadow-black">
          <Button className="bg-[#408dfb]" type="submit">
            Enregistrer
          </Button>

          <Button className="bg-white text-black border-gray-500 border-1 hover:bg-gray-200">
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewClientForm;
