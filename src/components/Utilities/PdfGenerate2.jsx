import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const PdfGenerate2 = ({ data }) => {
  const { idActividadPago, nombre_actividad, listaPersonas } = data;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Reporte de Personas Sin Pago",
    doc.internal.pageSize.getWidth() / 2,
    20,
    {
      align: "center",
    }
  );

  doc.setFontSize(15);
  //   doc.setTextColor(255, 0, 0);
  //   doc.text(`Nombre Actividad: ${nombreActividad}`, 10, 30);
  doc.setTextColor(0, 0, 0);
  doc.text("Nombre Actividad: ", 10, 30);

  doc.setTextColor(255, 0, 0);
  doc.text(`${nombre_actividad}`, 60, 30);

  doc.setTextColor(0, 0, 0);

  const tableData = listaPersonas.map((row) => [
    row.id_persona.toString(),
    row.nombre_apellido,
    row.cantidad,
  ]);

  autoTable(doc, {
    head: [["ID Persona", "Nombre y Apellido", "Cantidad"]],
    body: tableData,
    startY: 50,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 12,
    },
    bodyStyles: {
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { left: 10, right: 10 },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(
        `Página ${pageCount}`,
        data.settings.margin.left,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });
  doc.save(`ReportePersonaSinPago${idActividadPago}.pdf`);
};
