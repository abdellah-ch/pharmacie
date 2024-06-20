import { useState, useEffect } from "react";

const CommandPdf = (props: { commandId: number }) => {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    async function fetchPdfUrl() {
      const response = await fetch(
        `/api/pdfCommandeGeneration?commandeId=${props.commandId}`
      );
      const data = await response.json();
      if (data.pdfUrl) {
        setPdfUrl(data.pdfUrl);
      }
    }

    fetchPdfUrl();
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
