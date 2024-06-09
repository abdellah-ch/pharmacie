const page = ({ params }: { params: { productId: string } }) => {
  return (
    <div>
      <p>Product: {params.productId}</p>
    </div>
  );
};

export default page;
