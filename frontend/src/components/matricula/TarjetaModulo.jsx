import "./TarjetaModulo.css";

export default function TarjetaModulo({
  titulo,
  descripcion,
  textoBoton = "Entrar",
  onEntrar,
  colorBorde = "#b9d9e3",
}) {
  return (
    <article
      className="tarjeta-modulo"
      style={{
        "--color-borde-modulo": colorBorde,
      }}
    >
      <div className="tarjeta-modulo__contenido">
        <h3 className="tarjeta-modulo__titulo">
          {titulo}
        </h3>

        <p className="tarjeta-modulo__descripcion">
          {descripcion}
        </p>
      </div>

      <button
        type="button"
        className="tarjeta-modulo__boton"
        onClick={onEntrar}
      >
        {textoBoton}
      </button>
    </article>
  );
}