"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation"; // Usage: App router

const NewHeader = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="bg-white h-[10vh] flex items-center justify-between px-4">
      <div>
        <p className="text-[#212529] font-bold text-lg">{title}</p>
      </div>
      <div>
        <X className="cursor-pointer" onClick={() => router.back()} />
      </div>
    </div>
  );
};

export default NewHeader;
