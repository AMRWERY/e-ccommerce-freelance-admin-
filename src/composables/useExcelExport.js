import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

export function useExcelExport() {
  const exportDataToExcel = (data, options = {}) => {
    // Destructure options with defaults
    const {
      headers = [],
      columnWidths = [],
      filename = "export.xlsx",
      sheetName = "Data",
    } = options;

    // Create header row with styling
    const headerRow = headers.map((header) => ({
      v: header.label,
      s: {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
      },
    }));

    // Map data using custom mapper function
    const dataRows = data.map((item) =>
      headers.map((header) => {
        const value = header.mapper ? header.mapper(item) : item[header.key];

        return {
          v: value,
          t: header.type || "s", // default to string type
          s: header.cellStyle || {},
          z: header.numberFormat,
        };
      })
    );

    // Create worksheet
    const worksheet = utils.aoa_to_sheet([headerRow, ...dataRows]);

    // Set column widths if provided
    if (columnWidths.length) {
      worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));
    }

    // Create workbook
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate and save file
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, filename);
  };

  return { exportDataToExcel };
}
