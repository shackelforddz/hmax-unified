/* ── Asset drawings & factory records ────────────────────────────── */

export type DrawingType = "SLD" | "Schematic" | "FAT report" | "Structural layout";

export interface Drawing {
  name: string;
  type: DrawingType;
  ref: string;
  date: string;
}

export const ASSET_DRAWINGS: Record<string, Drawing[]> = {
  "ast-001": [
    { name: "Single-line diagram", type: "SLD", ref: "DWG-40A-SLD-01 · Rev C", date: "2009-03" },
    { name: "Protection & control schematic", type: "Schematic", ref: "DWG-40A-SCH-04 · Rev B", date: "2009-03" },
    { name: "Factory acceptance test report", type: "FAT report", ref: "FAT-40A-0091", date: "2009-05" },
    { name: "Foundation & structural layout", type: "Structural layout", ref: "DWG-40A-STR-02 · Rev A", date: "2009-02" },
  ],
  "ast-002": [
    { name: "Single-line diagram", type: "SLD", ref: "DWG-40A-SLD-01 · Rev D", date: "2011-04" },
    { name: "Protection & control schematic", type: "Schematic", ref: "DWG-40A-SCH-05 · Rev A", date: "2011-04" },
    { name: "Factory acceptance test report", type: "FAT report", ref: "FAT-40A-0114", date: "2011-06" },
    { name: "Foundation & structural layout", type: "Structural layout", ref: "DWG-40A-STR-03 · Rev A", date: "2011-03" },
  ],
  "ast-003": [
    { name: "Single-line diagram", type: "SLD", ref: "DWG-25B-SLD-02 · Rev B", date: "2013-05" },
    { name: "Cooling & auxiliary schematic", type: "Schematic", ref: "DWG-25B-SCH-03 · Rev A", date: "2013-05" },
    { name: "Factory acceptance test report", type: "FAT report", ref: "FAT-25B-0203", date: "2013-07" },
    { name: "Foundation & structural layout", type: "Structural layout", ref: "DWG-25B-STR-01 · Rev A", date: "2013-04" },
  ],
  "ast-004": [
    { name: "Single-line diagram", type: "SLD", ref: "DWG-25A-SLD-01 · Rev A", date: "2014-06" },
    { name: "Tap-changer schematic", type: "Schematic", ref: "DWG-25A-SCH-06 · Rev A", date: "2014-06" },
    { name: "Factory acceptance test report", type: "FAT report", ref: "FAT-25A-0241", date: "2014-08" },
    { name: "Foundation & structural layout", type: "Structural layout", ref: "DWG-25A-STR-02 · Rev A", date: "2014-05" },
  ],
};
