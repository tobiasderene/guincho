import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // O cualquier otro ícono que uses
import '../styles/BackButton.css'; // (opcional, si querés customizar estilo)

function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      <ArrowLeft size={20} />
    </button>
  );
}

export default BackButton;
