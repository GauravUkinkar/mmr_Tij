import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportDataToExcel = (data, filename = "MMR_DATA") => {
  if (!data || data.length === 0) {
    console.log("No data to export.");
    return;
  }

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Create a Blob and save
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${filename}.xlsx`);
};

export default ExportDataToExcel;
