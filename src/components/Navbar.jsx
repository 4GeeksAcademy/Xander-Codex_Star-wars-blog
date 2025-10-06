import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import swLogo from "../assets/img/starwars.png";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const { favorites } = store;

  const removeFav = (fav) =>
    dispatch({ type: "delete_favorite", payload: { uid: fav.uid, type: fav.type } });

  const imgFor = (type, uid) =>
    `https://starwars-visualguide.com/assets/img/${type === "people" ? "characters" : type}/${uid}.jpg`;

  return (
    <nav className="navbar ">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" style={{ marginLeft: 85 }}>
          <img
            src={swLogo}
            alt="Star Wars"
            style={{ height: 70 }}
            onError={(e) => {
              e.currentTarget.src =
                "https://cdn.freebiesupply.com/logos/large/2x/star-wars-logo-png-transparent.png";
            }}
          />
        </Link>

        <div className="dropdown" style={{ marginRight: 70 }}>
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            Favorites <span className="badge text-bg-dark ms-1">{favorites.length}</span>
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end p-0"
            style={{ minWidth: 360, maxHeight: 400, overflowY: "auto" }}
          >
            {favorites.length === 0 && (
              <li className="p-3 text-center text-muted">No hay favoritos todavía.</li>
            )}
            {favorites.map((f, i) => (
              <li
                key={`${f.type}-${f.uid}-${i}`}
                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-3 px-2 py-1">
                  <img
                    src={imgFor(f.type, f.uid)}
                    alt={f.name}
                    width={40}
                    height={40}
                    className="rounded"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/40x40?text=${f.type}`;
                    }}
                  />
                  <div className="d-flex flex-column">
                    <span className="fw-semibold">{f.name}</span>
                    <small className="text-muted">{f.type} · ID {f.uid}</small>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => removeFav(f)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
