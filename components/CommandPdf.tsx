import { useState, useEffect } from "react";

const CommandPdf = (props: { commandId: number }) => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const fetchPDF = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/pdfCommandeGeneration?commandeId=${props.commandId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      }

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDF();
  }, [props.commandId]);

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

export default CommandPdf;
