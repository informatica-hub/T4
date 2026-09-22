import { useSiteAssistant } from "../hooks/useSiteAssistant";

interface Props {
  onOpenModal: () => void;
  isModalOpen: boolean;
}

export function PabloFloatingGif({ onOpenModal, isModalOpen }: Props) {
  const { sendMessage, isLoading } = useSiteAssistant();

  const handleClick = () => {
    if (!isModalOpen) {
      onOpenModal();
    }
    
  };

   if (isModalOpen) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "10px",
        zIndex: 1000,
        cursor: "pointer",
      }}
    >
      <img
        src="/pablo.gif"
        alt="Pablo asistente"
        style={{
          width: "135px",
          height: "135px",
          objectFit: "contain",
          //borderRadius: "50%",
          //boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          transition: "transform 0.1s ease",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </div>
  );
}