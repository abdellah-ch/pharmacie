"use client";
import { Input } from "@/components/ui/input";
import { useClient } from "@/stores/clientStore";
import { useFournisseur } from "@/stores/fournisseurStore";
import { useProductsStore } from "@/stores/productStore";
import { usePathname } from "next/navigation";
const SearchComponent = () => {
  const pathname = usePathname();
  const { searchProducts } = useProductsStore();
  const { searchClient, fetchClient } = useClient();
  const { searchFournisseur } = useFournisseur();
  // console.log(pathname);

  const handleInputChange = (e: any) => {
    const query = e.target.value;
    if (pathname.includes("Produits")) {
      if (query === "") {
        fetchClient(15);
      }
      searchProducts(query);
    } else if (pathname.includes("Clients")) {
      searchClient(query);
    } else if (pathname.includes("Fournisseurs")) {
      searchFournisseur(query);
    }
  };
  return (
    <div className="bg-[#f7f7fe] h-[7vh] flex items-center p-6">
      <Input
        className="w-[35%] bg-[#ededf7]"
        placeholder="Rechercher"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchComponent;
