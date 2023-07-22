import { Predefined } from "../data/Predefined";

export function exportPredefinedData(predefinedData: Predefined[]) {
  const jsonData = JSON.stringify(predefinedData, null, 2); // Convert predefinedData to pretty-printed JSON
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "exported_templates.json"; // File name for the downloaded JSON file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function importPredefinedData(file: any): Promise<Predefined[]> {
  console.log("Start importPredefinedData");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target) {
        return;
      }

      try {
        const jsonData = JSON.parse(event.target.result?.toString() || "");
        resolve(Array.isArray(jsonData) ? jsonData : []);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        reject([]);
      }
    };

    reader.onerror = () => {
      console.error("Error reading the file.");
      reject([]);
    };

    // Read the file as text
    reader.readAsText(file);
  });
}
