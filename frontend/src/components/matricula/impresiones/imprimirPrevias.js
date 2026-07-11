export function imprimirPlanillaPrevias() {
  const contenido = document.getElementById(
    "planilla-previas-imprimir",
  );

  if (!contenido) return;

  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert(
      "El navegador bloqueó la ventana de impresión. Habilitá las ventanas emergentes.",
    );
    return;
  }

  ventana.document.write(`
    <html>
      <head>
        <title>Planilla de examen por previas</title>

        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          h2,
          h3,
          p {
            text-align: center;
          }

          h2 {
            color: #1e3a5f;
            margin-bottom: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }

          th,
          td {
            border: 1px solid #333;
            padding: 6px;
            text-align: center;
          }

          th {
            background-color: #1e3a5f !important;
            color: white !important;
          }

          .fecha-impresion {
            text-align: right;
            font-size: 13px;
            margin-bottom: 20px;
            color: #555;
          }

          .firmas {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
          }

          .firma {
            width: 40%;
            text-align: center;
            border-top: 1px solid #333;
            padding-top: 8px;
          }

          @page {
            size: A4 landscape;
            margin: 12mm;
          }
        </style>
      </head>

      <body>
        <p class="fecha-impresion">
          Fecha de impresión:
          ${new Date().toLocaleString("es-AR")}
        </p>

        ${contenido.innerHTML}

        <div class="firmas">
          <div class="firma">Firma docente</div>
          <div class="firma">Firma autoridad</div>
        </div>
      </body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
  ventana.print();
}