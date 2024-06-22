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

type Checked = DropdownMenuCheckboxItemProps["checked"];

const FournisseurHeader = () => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  return (
    <div className="bg-white h-[10vh] flex items-center justify-between p-2">
      <div>
        <p className="text-[#212529] font-bold text-lg">Tous les Fournisseur</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/Achats/Fournisseurs/new">
          <Button className="bg-[#408dfb] hover:bg-[#408dfb]">
            <Plus /> Nouveau
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FournisseurHeader;
