"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";

import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFilter } from "@/stores/filtermodelStore";
import { useState } from "react";

import { format } from "date-fns";
import { useClient } from "@/stores/clientStore";

import { usePathname } from "next/navigation";
import { useFournisseur } from "@/stores/fournisseurStore";
function DateFilterCommandesModel() {
  const pathname = usePathname();
  const { isOpen, onClose } = useFilter();
  const [query, setQuery] = useState<string>("");
  // console.log(query);

  const [startDate, setStartDate] = useState<Date>();

  const [endDate, setEndDate] = useState<Date>();
  const { fetchCommandsByClientAndDate } = useClient();
  const { fetchBonCommandesByFournisseurAndDate } = useFournisseur();
  const handelSubmit = async () => {
    if (startDate && endDate) {
      if (pathname.includes("Vente/Commande-Client")) {
        await fetchCommandsByClientAndDate(query, startDate, endDate);
      } else if (pathname.includes("Achats/Bon-Commande")) {
        await fetchBonCommandesByFournisseurAndDate(query, startDate, endDate);
      }
    }
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reacher Avancer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-left w-[30%]">
              client/fournisseur
            </Label>
            <Input
              id="name"
              className="col-span-3 w-[80%]"
              onChange={(val) => {
                setQuery(val.target.value);
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="username" className="text-left w-[30%]">
              Créé entre
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[80%] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Date </span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      // console.log(formattedDate);

                      setStartDate(new Date(formattedDate));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex  items-center gap-4">
            <Label htmlFor="username" className="text-left w-[30%]">
              et
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[80%] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Date </span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      // console.log(formattedDate);

                      setEndDate(new Date(formattedDate));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handelSubmit}>Rechercher</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DateFilterCommandesModel;
