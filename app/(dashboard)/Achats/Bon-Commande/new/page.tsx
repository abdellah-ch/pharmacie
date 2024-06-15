import NewBonCommandForm from "@/components/NewBonCommandForm";
import NewHeader from "@/components/NewHeader";

const page = () => {
  return (
    <>
      <NewHeader title="Noveau bon de cammande" />
      <NewBonCommandForm />
    </>
  );
};

export default page;
