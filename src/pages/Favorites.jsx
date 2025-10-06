import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

// Funcion parra obtener la URL de la imagen
const imgFor = (type, uid) =>
  `https://starwars-visualguide.com/assets/img/${type === "people" ? "characters" : type}/${uid}.jpg`;

export const Favorites = () => {
  const { store, dispatch } = useGlobalReducer();
  const { favorites } = store;
  const navigate = useNavigate();

  const goToDetails = (fav) => {
    if (fav.type === "people") navigate(`/DetallesPersonaje/${fav.uid}`);
    else navigate(`/single/${fav.type}/${fav.uid}`);
  };

  const deleteFavorite = (uid, type) =>
    dispatch({ type: "delete_favorite", payload: { uid, type } });

  if (favorites.length === 0) {
    return (
      <div className="container py-4">
        <h4 className="mb-3">Favoritos (0)</h4>
        <div className="alert alert-warning text-center">No hay favoritos todavía.</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="mb-3">Favoritos ({favorites.length})</h4>

      <div className="d-flex flex-wrap" style={{ gap: "1rem" }}>
        {favorites.map((fav) => (
          <div key={`${fav.type}-${fav.uid}`} style={{ width: "180px" }}>
            <div className="card bg-dark border-0 shadow-sm h-100">
              <div className="ratio ratio-1x1" style={{ cursor: "pointer" }}>
                <img
                  src={imgFor(fav.type, fav.uid)}
                  alt={fav.name}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onClick={() => goToDetails(fav)}
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/600x600?text=${fav.type}+${fav.uid}`;
                  }}
                />
              </div>
              <div className="card-body text-center">
                <h6 className="card-title text-light text-truncate mb-2">{fav.name}</h6>
                <button
                  className="btn btn-sm btn-danger w-100"
                  onClick={() => deleteFavorite(fav.uid, fav.type)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
