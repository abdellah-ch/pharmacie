import CommandeInfoSheet from "../CommandeInfoSheet";
import ProduitInfoSheet from "../ProduitInfoSheet";

const SheetProvider = () => {
  return (
    <>
      <ProduitInfoSheet />
      <CommandeInfoSheet />
    </>
  );
};

export default SheetProvider;
