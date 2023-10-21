import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const regresar = () => {
    navigate("/home");
  };
  return (
    <>
      <div className="contenedor mt-5">
        <div className="rows">
          <h1 className="text-center h1NOt">404</h1>
          <div className="four_zero_four_gb"></div>
          <h3 className="h2 mtt">página no encontrada</h3>
          <div className="mt-5 text-center">
            <button
              className="btn btn-outline-secondary"
              style={{ width: "50%", padding: "18px", fontSize: 20 }}
              onClick={regresar}
            >
              ..:: Regresar ::..
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;