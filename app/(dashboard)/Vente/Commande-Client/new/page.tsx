import NewCommandeClientForm from "@/components/NewCommandeClientForm";
import NewHeader from "@/components/NewHeader";

const page = () => {
  return (
    <div className="">
      <NewHeader title="Nouvelle commande client" />
      <NewCommandeClientForm />
    </div>
  );
};

export default page;
