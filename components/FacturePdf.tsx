import { useState, useEffect } from "react";
const FacturePdf = (props: { commandId: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const fetchPdfUrl = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/pdfFactureGeneration?commandeId=${props.commandId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPdfUrl();
  }, [props.commandId]);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          style={{ border: "none" }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FacturePdf;
