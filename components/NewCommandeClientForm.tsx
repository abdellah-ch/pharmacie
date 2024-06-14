"use client";
import {
  InsertCommandInfo,
  getRecentClients,
  searchClients,
} from "@/lib/Client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { ProductsStore, useProductsStore } from "@/stores/productStore";
import { format } from "date-fns";
import { Categorie, Produit, Stock } from "@prisma/client";

const NewCommandeClientForm = () => {
  //table logic
  interface Row {
    productName: string;
    quantity: number;
    monto: number;
    product_id: number;
    product_img: string | null;
    stock: number | undefined;
    prix_vente: number;
  }
  const [rows, setRows] = useState<Row[]>([
    {
      productName: "",
      quantity: 1,
      monto: 0,
      product_id: 0,
      product_img: "",
      stock: 0,
      prix_vente: 0,
    },
  ]);

  const { products, fetchProducts, searchProducts } = useProductsStore();
  const [clientId, setClientId] = useState<number>(0);
  // const [products, setProducts] = useState<
  //   | (Produit & {
  //       montantTotal?: number;
  //       categorie: Categorie;
  //       stock: Stock | null;
  //     })
  //   | null
  // >(null);

  const [produitsearchQuery, setProduitSearchQuery] = useState<string>("");
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        productName: "",
        quantity: 1,
        monto: 0,
        product_id: 0,
        product_img: "",
        stock: 0,
        prix_vente: 0,
      },
    ]);
  };

  console.log(rows);

  // useEffect
  useEffect(() => {
    fetchProducts(5);
  }, []);

  //table logic
  type Client = {
    client_id: number;
    nom: string;
    email: string;
    nomSociete?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: number | null;
    Region?: string | null;
    createdAt: Date;
  };
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const [date, setDate] = useState<Date | null>(null);
  // const router = useRouter();
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getRecentClients();
        setClients(clients);
        setFilteredClients(clients);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const searchForClients = async () => {
      try {
        const clients = await searchClients(searchQuery);
        setFilteredClients(clients);
      } catch (error) {
        console.error("Failed to search clients", error);
      }
    };

    if (searchQuery) {
      searchForClients();
    } else {
      setFilteredClients(clients);
    }
  }, [searchQuery, clients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };
  const handelSubmit = async () => {
    try {
      await InsertCommandInfo(clientId, rows);
      alert("inserted");
    } catch (error) {
      console.error("Failed to create client", error);
    }
  };
  return (
    <div className="example flex flex-col h-[73vh] w-full overflow-y-scroll">
      {/* <form onSubmit={() => {}}> */}
      <div className="bg-[#f7f7fe] flex gap-20 p-6">
        <div className="w-[45%]">
          <div className="flex flex-col gap-5">
            <div className="flex gap-20 items-center">
              <label className="text-red-500 w-[30%] text-xs">
                Nom du client*
              </label>
              <Select
                onValueChange={(val) => {
                  console.log(val);
                  setClientId(Number(val));
                  // setClientId(Number(val));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un Client" />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    type="text"
                    placeholder="Rechercher"
                    className="w-full px-2 py-1 border-b"
                    // value={searchQuery}
                    onChange={handleSearch}
                  />
                  {filteredClients.map((client) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={client.client_id}
                      value={client.client_id.toString()}
                    >
                      <p>{client.nom}</p>
                      <p>{client.email}</p>
                    </SelectItem>
                  ))}

                  <Button
                    className="w-full px-2 py-1 text-center bg-blue-500 text-white"
                    // onClick={() => router.push("/newClient")}
                  >
                    Créer un Client
                  </Button>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-20 items-center">
              <label className="text-red-500 w-[30%] text-xs">
                Date de la commande*
              </label>
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
                    {date ? format(date, "PPP") : <span>Date </span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    // selected={date}
                    // onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      {/*Chat table  */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>DÉTAILS DE L'ARTICLE</TableHead>
            <TableHead>QUANTITÉ</TableHead>
            <TableHead>MONTANT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Popover>
                  <PopoverTrigger className="w-full">
                    {!row.productName ? (
                      <Input
                        // onClick={() => setShowPopover(true)}
                        onChange={(e) => {
                          // setShowPopover(true);
                          // console.log(e.target.value);
                          setProduitSearchQuery(e.target.value);
                          // setProduitSearchQuery(e.currentTarget.nodeValue);
                          searchProducts(e.target.value);
                        }}
                        placeholder="Saisissez ou cliquez sur pour sélectionner un article."
                      />
                    ) : (
                      <div className="border-2 p-2 rounded-md ">
                        <div className="flex justify-start gap-3">
                          <img width={20} src={row.product_img || ""} alt="w" />

                          <p>{row.productName}</p>
                        </div>
                      </div>
                    )}
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[500px]"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <div>
                      {products.map((product) => (
                        <div
                          key={product.produit_id}
                          onClick={(e) => {
                            // setShowPopover(false);
                            //show a div instad of input and set the value of the montant
                            // row.monto = product.prix_Vente * row.quantity;
                            setRows((preRows) => {
                              const newRows = [...preRows];
                              newRows[index].prix_vente = product.prix_Vente;

                              newRows[index].product_id = product.produit_id;

                              newRows[index].product_img = product.photo;

                              newRows[index].monto = product.prix_Vente;

                              newRows[index].stock =
                                product.stock?.stock_disponible;
                              newRows[index].productName = product.designation;

                              return newRows;
                            });
                          }}
                          className="flex justify-between cursor-pointer p-2 hover:bg-blue-500 border-b-2"
                        >
                          <div>{product.designation}</div>
                          <div>
                            <p className="text-sm text-gray-600">
                              stock disponible :
                              {product.stock?.stock_disponible}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => {
                    setRows((preRows) => {
                      const newRows = [...preRows];
                      newRows[index].quantity = Number(e.target.value);

                      newRows[index].monto =
                        Number(e.target.value) * row.prix_vente;
                      return newRows;
                    });
                  }}
                />
              </TableCell>

              <TableCell>{row.prix_vente * row.quantity}</TableCell>
              <TableCell>
                <Button
                  onClick={() => setRows(rows.filter((_, i) => i !== index))}
                  className="text-danger bg-transparent"
                >
                  X
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              <Button onClick={handleAddRow}>Ajouter Un article</Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {/* <div className="flex justify-start mt-5">
          <Button onClick={handleAddRow}>Add Row</Button>
        </div> */}
      {/* table */}
      <div className="w-[100%] p-6 bg-white absolute bottom-0 h-[10vh] flex gap-4 items-center shadow-lg shadow-black">
        <Button onClick={handelSubmit} className="bg-[#408dfb]" type="submit">
          Enregistrer
        </Button>

        <Button className="bg-white text-black border-gray-500 border-1 hover:bg-gray-200">
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default NewCommandeClientForm;
