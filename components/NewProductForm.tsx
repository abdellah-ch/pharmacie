"use client";
import * as React from "react";

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
import "@uploadthing/react/styles.css";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, getYear } from "date-fns";

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
import {
  fetchCategories,
  ajouterCategorie,
  ajouterProduitAvecStock,
} from "@/lib/Produit";
import { Label } from "@radix-ui/react-dropdown-menu";
import { UploadButton } from "@/lib/uploadthing";

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
    // console.log(data);
    // console.log(errors);
    const inputs = {
      code_produit: data.CodeProduit,
      description: data.Description,
      designation: data.Nom,
      prix_Achat: data.PrixAchat,
      prix_Vente: data.PrixVente,
      date_expiration: date,
      quantite: data.Stock,
      photo: imageUrl,
      categorie_id: categorie_id,
      Seuil_reapprovisionnement: data.SeuilReapprovisionnement,
    };
    console.log(inputs);

    ajouterProduitAvecStock(
      inputs.code_produit,
      inputs.description,
      inputs.designation,
      inputs.prix_Achat,
      inputs.prix_Vente,
      inputs.date_expiration,
      inputs.quantite,
      inputs.photo,
      inputs.categorie_id,
      inputs.Seuil_reapprovisionnement
    )
      .then((res) => {
        alert("inserted");
      })
      .catch((err) => {
        alert(err);
      });
  };
  const [imageUrl, setImageUrl] = useState<string>("");
  const [categorie_id, setCategorie_id] = useState<number>(0);

  // console.log(categorie_id);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [date, setDate] = React.useState<Date | null>(null);
  // if (date) console.log(date);

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
                  <Select
                    onValueChange={(val) => {
                      setCategorie_id(Number(val));
                    }}
                  >
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
                            <Label className="text-right">Name</Label>
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
          <div className="w-[25%] text-black flex flex-col gap-14 items-left ">
            {imageUrl === "" ? (
              <UploadButton
                className="w-[45%] p-0"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  // console.log("Files: ", res);
                  setImageUrl(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            ) : (
              <img width={250} height={250} src={imageUrl} alt="none" />
            )}
            {/* <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[80%] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Date d'expiration</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div> */}
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
                <label className="w-[30%] text-xs text-[#212529]">
                  Stock alerte
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

          <Button className="bg-white text-black border-gray-500 border-1 hover:bg-gray-200">
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProductForm;
