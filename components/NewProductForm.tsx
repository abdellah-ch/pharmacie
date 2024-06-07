"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import UploadIcon from "@/public/images/uploadIcon.png";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Categorie } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchCategories, ajouterCategorie } from "@/lib/Produit";
import { Label } from "@radix-ui/react-dropdown-menu";

type FormData = {
  Nom: string;
  CodeProduit: string;
  Categorie: number;
  Description: string;
  PrixAchat: number; // Type for number validation
  Stock: number; // Type for number validation
  SeuilReapprovisionnement: number; // Type for number validation
  PrixVente: number; // Type for number validation
  ImageUrl?: string; // Optional image URL
};

const NewProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
    console.log(errors);
  };

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  useEffect(() => {
    const loadCategories = async () => {
      const result = await fetchCategories(searchQuery);
      setCategories(result);
    };
    loadCategories();
  }, [searchQuery]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() !== "") {
      await ajouterCategorie(newCategoryName);
      setModalOpen(false);
      setSearchQuery("");
      setNewCategoryName("");
      const result = await fetchCategories();
      setCategories(result);
    }
  };

  return (
    <div className="example flex flex-col  h-[73vh] w-full overflow-y-scroll  ">
      {/* paste */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" bg-[#f7f7fe]   flex gap-20 p-6">
          <div className="w-[45%]">
            <div className="flex flex-col gap-5">
              <div className="flex gap-20 items-center">
                <label className="text-red-500 w-[30%] text-xs ">Nom*</label>
                <Input
                  type="text"
                  {...register("Nom", { required: "Saisir le nom" })}
                  className="outline-none focus:none"
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Code Produit
                </label>
                <Input
                  type="text"
                  {...register("CodeProduit", {
                    required: "Saisir Le Code Produit",
                  })}
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Categorie
                </label>
                {/* <Input
                  type="text"
                  {...register("Categorie", {
                    required: "Categorie is required",
                  })}
                  autoComplete="off"
                /> */}
                <div className="w-full">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectioner une Categorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <Input
                        type="text"
                        placeholder="Search"
                        className="w-full px-2 py-1 border-b"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                      {categories.map((category) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={category.categorie_id}
                          value={category.categorie_id.toString()}
                        >
                          {category.nom}
                        </SelectItem>
                      ))}

                      <Button
                        className="w-full px-2 py-1 text-center bg-blue-500 text-white"
                        onClick={() => setModalOpen(true)}
                      >
                        Gérer les Categorie
                      </Button>
                    </SelectContent>
                  </Select>

                  {isModalOpen && (
                    <Dialog open>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Ajouter Une categorie</DialogTitle>
                          <DialogDescription>
                            Entrer Le nom de la categorie
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              className="col-span-3"
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleAddCategory}>
                            Enregistrer
                          </Button>
                          <Button onClick={() => setModalOpen(false)}>
                            Annuler
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Description
                </label>
                <Textarea
                  {...register("Description", {
                    required: "Description is required",
                  })}
                  autoComplete="off"
                />
              </div>

              {/* <button type="submit">ok</button> */}
            </div>
          </div>
          <div className="w-[20%]">
            <div className="flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-4">
              <div className="text-center">
                <Image
                  alt="image upload"
                  width={50}
                  src={UploadIcon}
                  className="mx-auto mb-4"
                />
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Faire glisser l’image ou les images ici ou{" "}
                  <a href="#" className="text-blue-600">
                    Parcourir les images
                  </a>
                </p>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-2">
                  Vous pouvez ajouter jusqu’à 15 images, chacune ne dépassant
                  pas 5 Mo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 flex gap-20">
          <div className="w-[45%]">
            <div className="flex flex-col gap-5">
              <div className="flex gap-20 items-center">
                <label className="text-red-500 w-[30%] text-xs">
                  Prix d'Achat*
                </label>
                <div className=" w-full flex items-center border border-zinc-300 rounded-lg ">
                  <span className="px-4 py-2 border-r rounded-l-md border-zinc-300 bg-[#f7f7fe]">
                    MAD
                  </span>
                  <Input
                    type="number"
                    className=" outline-none border-none focus:ring-0"
                    {...register("PrixAchat", {
                      required: "PrixAchat is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Le prix d'achat doit être positif",
                      },
                    })}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="flex gap-20 items-center">
                <label className="w-[30%] text-xs text-[#212529]">
                  Stock d'ouverture
                </label>
                <Input
                  type="number"
                  {...register("Stock", {
                    required: "Stock douverture is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Le stock d'ouverture doit être positif",
                    },
                  })}
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-20 items-center">
                <label className="max-w-[30%] text-xs text-[#212529]">
                  Seuil de réapprovisionnement
                </label>
                <Input
                  type="number"
                  {...register("SeuilReapprovisionnement", {
                    required: "SeuilReapprovisionnement is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message:
                        "Le seuil de réapprovisionnement doit être positif",
                    },
                  })}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className="w-[40%]">
            <div className="flex flex-col gap-5">
              <div className="flex gap-20 items-center">
                <label className="text-red-500 w-[30%] text-xs">
                  Prix de Vente*
                </label>
                <div className=" w-full flex items-center border border-zinc-300 rounded-lg ">
                  <span className="px-4 py-2 border-r rounded-l-md border-zinc-300 bg-[#f7f7fe]">
                    MAD
                  </span>
                  <Input
                    type="number"
                    className="rounded-none"
                    {...register("PrixVente", {
                      required: "Prix Vente is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Le prix de vente doit être positif",
                      },
                    })}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="w-[100%] p-6  bg-white absolute bottom-0 h-[10vh] flex gap-4 items-center shadow-lg shadow-black  ">
          <Button className="bg-[#408dfb]" type="submit">
            Enregistrer
          </Button>

          <Button className="bg-white text-black border border-gray-500 border-1">
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProductForm;
