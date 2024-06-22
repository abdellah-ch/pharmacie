import BonCommandeSheet from "../BonCommandeSheet";
import CommandeInfoSheet from "../CommandeInfoSheet";
import DateFilterCommandesModel from "../DateFilterCommandesModel";
import ProduitInfoSheet from "../ProduitInfoSheet";

const SheetProvider = () => {
  return (
    <>
      <ProduitInfoSheet />
      <CommandeInfoSheet />
      <BonCommandeSheet />
      <DateFilterCommandesModel />
    </>
  );
};

export default SheetProvider;
