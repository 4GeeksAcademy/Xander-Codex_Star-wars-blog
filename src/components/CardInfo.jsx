import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ModalInfo from "./ModalInfo";

// Devuelve la URL de la imagen o placeholder
const imgFor = (type, uid) => {
  const t = type === "people" ? "characters" : type;
  return `https://starwars-visualguide.com/assets/img/${t}/${uid}.jpg`;
};

export default function CardInfo({ type, item }) {
  const { store, dispatch } = useGlobalReducer();
  const [open, setOpen] = useState(false);

  const isFav = store.favorites.some(f => f.uid === item.uid && f.type === type);

  const toggleFav = () => {
    if (isFav) {
      dispatch({ type: "delete_favorite", payload: { uid: item.uid, type } });
    } else {
      dispatch({ type: "get_favorite", payload: { ...item, type } });
    }
  };

  return (
    <div style={{ width: "180px", marginBottom: "1rem" }}>
      <div className="card bg-dark border-0 shadow-sm h-100">
        <div className="ratio ratio-1x1" style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
          <img
            src={imgFor(type, item.uid)}
            alt={item.name}
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x600?text=${type}+${item.uid}`;
            }}
          />
        </div>
        <div className="card-body text-center">
          <h6 className="card-title text-light text-truncate mb-2">{item.name}</h6>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
              Detalles
            </button>
            <button
              className={`btn btn-sm ${isFav ? "btn-warning" : "btn-outline-warning"}`}
              onClick={toggleFav}
              title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isFav ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <ModalInfo open={open} onClose={() => setOpen(false)} type={type} item={item} />
      )}
    </div>
  );
}
