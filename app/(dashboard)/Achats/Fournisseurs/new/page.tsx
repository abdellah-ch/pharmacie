import NewFournisseurForm from "@/components/NewFournisseurForm";
import NewHeader from "@/components/NewHeader";

const page = () => {
  return (
    <>
      <NewHeader title="Nouvaux Fournisseur" />
      <NewFournisseurForm />
    </>
  );
};

export default page;
