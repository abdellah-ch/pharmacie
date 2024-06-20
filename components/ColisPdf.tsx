import {
  CheckIfColisExists,
  CreeColis,
  updateColisStatusToLivree,
} from "@/lib/Colis";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdEmail } from "react-icons/md";

const ColisPdf = (props: { commandId: number }) => {
  const [colisExist, setColisExist] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");

  const UpdateColiStatus = async () => {
    setIsLoading(true);
    updateColisStatusToLivree(props.commandId);
    checkColis();
    setIsLoading(false);
  };
  const checkColis = async () => {
    setIsLoading(true);
    const res = await CheckIfColisExists(props.commandId);
    if (res) {
      setColisExist(true);
      setStatus(res.status);
    } else {
      setColisExist(res);
    }
    setIsLoading(false);
  };

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    checkColis();
    async function fetchPdfColis() {
      const response = await fetch(
        `/api/pdfColisGeneration?commandeId=${props.commandId}`
      );
      const data = await response.json();
      if (data.pdfUrl) {
        setPdfUrl(data.pdfUrl);
      }
      //
      // setIsLoading(false);
    }
    async function fetchPdflivraison() {
      const response = await fetch(
        `/api/pdfOrdreLivraisonGeneration?commandeId=${props.commandId}`
      );
      const data = await response.json();
      if (data.pdfUrl) {
        setPdfUrl(data.pdfUrl);
      }
      //
      // setIsLoading(false);
    }
    if (status === "EMBALLE") {
      fetchPdfColis();
    } else {
      fetchPdflivraison();
    } // setIsLoading(false);
  }, [props.commandId, status, colisExist]);

  if (isLoading) {
    return <div>loading...</div>;
  } else if (isLoading === false) {
    return (
      <div className="w-full">
        {colisExist ? (
          status === "EMBALLE" ? (
            <div className="w-full">
              <div className="mb-4 flex items-center space-x-4 p-2 bg-white dark:bg-zinc-800 border-y border-zinc-200 dark:border-zinc-700">
                {/* <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                  <img
                    src="https://placehold.co/16"
                    alt="edit"
                    className="w-4 h-4"
                  />
                  <span>Modifier</span>
                </button> */}
                <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                  <MdEmail />
                  <span>E-mail</span>
                </button>
                <div className="relative">
                  {/* <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                    <img
                      src="https://placehold.co/16"
                      alt="pdf"
                      className="w-4 h-4"
                    />
                    <span>PDF/Impression</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button> */}
                </div>
                <button
                  onClick={UpdateColiStatus}
                  className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500"
                >
                  <CiBookmarkCheck />

                  <span>Marquer comme livré</span>
                </button>
                {/* <div className="relative">
                  <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                    <span>Create</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </div>
                <button className="text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 12h12M6 6h12M6 18h12"
                    ></path>
                  </svg>
                </button> */}
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
          )
        ) : (
          <Button
            onClick={() => {
              CreeColis(props.commandId);
              checkColis();
            }}
          >
            Créé le Colis
          </Button>
        )}
      </div>
    );
  }
};

export default ColisPdf;
