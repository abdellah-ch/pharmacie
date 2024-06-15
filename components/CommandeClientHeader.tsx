"use client";
import * as React from "react";

import { GripVertical, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useFilter } from "@/stores/filtermodelStore";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const CommandeClientHeader = () => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);

  const { isOpen, onClose, onOpen } = useFilter();
  return (
    <div className="bg-white h-[10vh] flex items-center justify-between p-2">
      <div className="flex gap-5 justify-center items-center">
        <p className="text-[#212529] font-bold text-lg">
          Tous les Commande Client
        </p>
        <Button onClick={onOpen}>Recherch Avancée</Button>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/Vente/Commande-Client/new">
          <Button className="bg-[#408dfb] hover:bg-[#408dfb]">
            <Plus /> Nouveau
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="p-2 bg-white text-black hover:bg-white">
              <GripVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Trier Par</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
              disabled
            >
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CommandeClientHeader;
