import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Devuelve la URL de la imagen o placeholder si no existe
const imgFor = (type, uid) => {
  const t = type === "people" ? "characters" : type;
  return `https://starwars-visualguide.com/assets/img/${t}/${uid}.jpg`;
};

export const CharacterInfo = () => {
  const { uid } = useParams();
  const [data, setData] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://www.swapi.tech/api/people/${uid}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json.result || json);
      } catch (e) {
        console.error(e);
        if (!cancelled) setData({ error: "No se cargo el detalle." });
      }
    })();
    return () => { cancelled = true; };
  }, [uid]);

  const props = data?.properties || {};
  const name = props.name || data?.uid || `people ${uid}`;

  return (
    <div className="container py-4">
      <button className="btn btn-link mb-3" onClick={() => nav(-1)}>
        &larr; Volver
      </button>

      {!data ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status" aria-label="Cargando" />
        </div>
      ) : data?.error ? (
        <div className="alert alert-danger">{data.error}</div>
      ) : (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm h-100">
              <img
                src={imgFor("people", uid)}
                className="card-img-top"
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/800x600?text=people+${uid}`;
                }}
              />
              <div className="card-body">
                <a
                  className="btn btn-outline-secondary w-100"
                  href={`https://www.swapi.tech/api/people/${uid}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver JSON
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h4 mb-1">{name}</h2>
                <p className="text-muted mb-3">Tipo: people · ID: {uid}</p>
                <dl className="row">
                  {Object.entries(props).map(([k, v]) => (
                    <div className="mb-1" key={k}>
                      <dt className="col-sm-4 text-capitalize">{k.replaceAll("_", " ")}</dt>
                      <dd className="col-sm-8">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
                {data.description && <p className="mb-0"><em>{data.description}</em></p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
