import {
  CheckIfColisExists,
  CreeColis,
  updateColisStatusToLivree,
} from "@/lib/Colis";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { useClient } from "@/stores/clientStore";

const ColisPdf = (props: { commandId: number }) => {
  const { commandes, loading, fetchCommands } = useClient();
  const [colisExist, setColisExist] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const checkColis = useCallback(async () => {
    setIsLoading(true);
    const res = await CheckIfColisExists(props.commandId);
    if (res) {
      setColisExist(true);
      setStatus(res.status);
    } else {
      setColisExist(false);
    }
    setIsLoading(false);
  }, [props.commandId]);

  const UpdateColiStatus = useCallback(async () => {
    setIsLoading(true);
    await updateColisStatusToLivree(props.commandId);
    setStatus("LIVREE");
    checkColis();
    fetchCommands(15);
  }, [props.commandId, checkColis]);

  const fetchPdfColis = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/pdfColisGeneration?commandeId=${props.commandId}`,
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
  }, [props.commandId]);

  const fetchPdflivraison = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/pdfOrdreLivraisonGeneration?commandeId=${props.commandId}`,
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
  }, [props.commandId]);

  useEffect(() => {
    checkColis();
  }, [checkColis]);

  useEffect(() => {
    if (status === "EMBALLE") {
      fetchPdfColis();
    } else if (status === "LIVREE") {
      fetchPdflivraison();
    }
  }, [status, fetchPdfColis, fetchPdflivraison]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      {colisExist ? (
        status === "EMBALLE" ? (
          <div className="w-full">
            <div className="mb-4 flex items-center space-x-4 p-2 bg-white dark:bg-zinc-800 border-y border-zinc-200 dark:border-zinc-700">
              <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                <MdEmail />
                <span>E-mail</span>
              </button>
              <div className="relative"></div>
              <button
                onClick={UpdateColiStatus}
                className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500"
              >
                <CiBookmarkCheck />
                <span>Marquer comme livré</span>
              </button>
            </div>
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
        ) : (
          <>
            <div className=" w-full mt-0 mb-4 flex items-center space-x-4 p-2 bg-[#ebeaf2s] dark:bg-zinc-800 border-y border-zinc-200 dark:border-zinc-700">
              <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                <MdEmail />
                <span>Envoyer un E-mail</span>
              </button>
              <div className="relative"></div>
              <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                <CiBookmarkCheck />

                <span>{status}</span>
              </button>
            </div>
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
          </>
        )
      ) : (
        <Button
          onClick={async () => {
            await CreeColis(props.commandId);
            checkColis();
          }}
        >
          Créé le Colis
        </Button>
      )}
    </div>
  );
};

export default ColisPdf;
