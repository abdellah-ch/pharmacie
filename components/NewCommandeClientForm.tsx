"use client";
import { getRecentClients, searchClients } from "@/lib/Client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import { format, getYear } from "date-fns";

const NewCommandeClientForm = () => {
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
    setSearchQuery(e.target.value);
  };

  return (
    <div className="example flex flex-col h-[73vh] w-full overflow-y-scroll">
      {/* <form onSubmit={() => {}}> */}
      <form>
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
                      value={searchQuery}
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
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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

export default NewCommandeClientForm;
