import { useEffect, useState } from "react";

// Devuelve la URL de la imagen o placeholder
const imgFor = (type, uid) => {
  const t = type === "people" ? "characters" : type;
  return `https://starwars-visualguide.com/assets/img/${t}/${uid}.jpg`;
};

export default function ModalInfo({ open, onClose, type, item }) {
  const [data, setData] = useState(null);
  const uid = item?.uid;

  useEffect(() => {
    if (!open || !uid) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`https://www.swapi.tech/api/${type}/${uid}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json.result || json);
      } catch {
        if (!cancelled) setData({ error: "No se pudo cargar el detalle." });
      }
    })();

    return () => { cancelled = true; };
  }, [open, type, uid]);

  if (!open) return null;

  const props = data?.properties || {};
  const title = props.name || props.model || props.title || item?.name || `${type} ${uid}`;

  const fallbackDescription = () => {
    if (type === "people") {
      return `${props.name} es un personaje de género ${props.gender ?? "desconocido"}, nacido en ${props.birth_year ?? "desconocido"}, altura ${props.height ?? "?"}cm, ojos ${props.eye_color ?? "?"}.`;
    }
    if (type === "vehicles") {
      return `${props.name || props.model} — modelo: ${props.model ?? "?"}, fabricante: ${props.manufacturer ?? "?"}, costo: ${props.cost_in_credits ?? "?"} créditos, tripulación: ${props.crew ?? "?"}.`;
    }
    if (type === "planets") {
      return `${props.name} — clima: ${props.climate ?? "?"}, terreno: ${props.terrain ?? "?"}, población: ${props.population ?? "?"}.`;
    }
    return "";
  };

  const desc = data?.description || fallbackDescription();

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>

          <div className="modal-body">
            {!data ? (
              <div className="d-flex justify-content-center my-4">
                <div className="spinner-border" role="status" aria-label="Cargando" />
              </div>
            ) : data?.error ? (
              <div className="alert alert-danger">{data.error}</div>
            ) : (
              <div className="row g-3">
                <div className="col-md-5">
                  <img
                    src={imgFor(type, uid)}
                    alt={title}
                    className="img-fluid rounded"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/600x600?text=${type}+${uid}`;
                    }}
                  />
                </div>
                <div className="col-md-7">
                  {desc && <p className="text-muted"><em>{desc}</em></p>}
                  <dl className="row mb-0">
                    {Object.entries(props).map(([k, v]) => (
                      <div key={k} className="mb-1">
                        <dt className="col-sm-4 text-capitalize">{k.replaceAll("_", " ")}</dt>
                        <dd className="col-sm-8">{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <a
              className="btn btn-outline-secondary"
              href={`https://www.swapi.tech/api/${type}/${uid}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver JSON
            </a>
            <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
