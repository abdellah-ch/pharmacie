import CommandeInfoSheet from "../CommandeInfoSheet";
import DateFilterCommandesModel from "../DateFilterCommandesModel";
import ProduitInfoSheet from "../ProduitInfoSheet";

const SheetProvider = () => {
  return (
    <>
      <ProduitInfoSheet />
      <CommandeInfoSheet />

      <DateFilterCommandesModel />
    </>
  );
};

export default SheetProvider;
