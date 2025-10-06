import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import CardInfo from "./CardInfo";

const API = "https://www.swapi.tech/api";

export default function SectionInfo({ entity, title }) {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const keyByEntity = { people: "characters", vehicles: "vehicles", planets: "planets" };
  const actionByEntity = { people: "get_character", vehicles: "get_vehicle", planets: "get_planet" };

  const list = store[keyByEntity[entity]] || [];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${API}/${entity}?page=1&limit=12`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          dispatch({ type: actionByEntity[entity], payload: json.results || [] });
        }
      } catch {
        if (!cancelled) setError(`No se pudieron cargar ${title.toLowerCase()}.`);
        dispatch({ type: actionByEntity[entity], payload: [] });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [entity, dispatch, title]);

  return (
    <section className="container my-4">
      <h5 className="text-start mb-3">{title}</h5>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {!loading && !error && (
        list.length > 0 ? (
          <div className="d-flex flex-wrap" style={{ gap: "1rem" }}>
            {list.map((item) => (
              <CardInfo key={item.uid} type={entity} item={item} />
            ))}
          </div>
        ) : (
          <div className="alert alert-warning text-center">Sin resultados.</div>
        )
      )}
    </section>
  );
}
