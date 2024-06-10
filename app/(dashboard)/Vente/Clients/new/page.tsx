import NewClientForm from "@/components/NewClientForm";
import NewHeader from "@/components/NewHeader";

const page = () => {
  return (
    <div>
      <NewHeader title="Nouveau client" />
      <NewClientForm />
    </div>
  );
};

export default page;
