import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

export function useExcelExport() {
  /**
   * Export data to an Excel file.
   * @param {Array} data - Array of objects to export.
   * @param {Object} options - Options for headers and filename.
   */
  const exportDataToExcel = (data, options = {}) => {
    // Define header row with styling; you can customize or pass this via options.
    const header = options.header || [
      {
        v: "#",
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
        },
      },
      {
        v: "Product Name",
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
        },
      },
      {
        v: "Color",
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
        },
      },
      {
        v: "Category",
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
        },
      },
      {
        v: "Price",
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
        },
      },
    ];

    // Map your data into an array-of-arrays (AOA)
    const dataRows = data.map((product) => [
      { v: product.id, s: { alignment: { horizontal: "center" } } },
      { v: product.name, s: { font: { name: "Arial", sz: 12 } } },
      { v: product.color, s: { fill: { fgColor: { rgb: "F2F2F2" } } } },
      { v: product.category },
      {
        v: product.price,
        t: "n", // number type
        z: "$#,##0.00", // currency format
        s: { font: { color: { rgb: "00AA00" }, bold: true } },
      },
    ]);

    // Combine header and data rows into a sheet
    const worksheet = utils.aoa_to_sheet([header, ...dataRows]);

    // Set column widths (optional)
    worksheet["!cols"] = [
      { wch: 5 }, // Width for "#"
      { wch: 25 }, // Product Name
      { wch: 15 }, // Color
      { wch: 20 }, // Category
      { wch: 15 }, // Price
    ];

    // Create a workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Products");

    // Generate a buffer and create a Blob for saving
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the file using file-saver
    saveAs(blob, options.filename || "styled_products.xlsx");
  };

  return {
    exportDataToExcel,
  };
}
