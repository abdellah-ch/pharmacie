import { useState, useEffect, useCallback } from "react";

const CommandPdf = (props: { commandId: number }) => {
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);

  const fetchPDF = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/pdfCommandeGeneration?commandeId=${props.commandId}`,
        {
          method: "GET",
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
  }, [props.commandId]);

  useEffect(() => {
    fetchPDF();
  }, [fetchPDF]);

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div className="w-full">
      {pdfUrl != undefined ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          style={{ border: "none" }}
        />
      ) : (
        <p>loading ....</p>
      )}
    </div>
  );
};

export default CommandPdf;
