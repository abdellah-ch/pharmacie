"use client";
import CommandeClientHeader from "@/components/CommandeClientHeader";
import CommandeList from "@/components/commandeList";
import { useEffect, useState } from "react";

const page = () => {
  return (
    <div>
      <CommandeClientHeader />
      <CommandeList />
    </div>
  );
};

export default page;
