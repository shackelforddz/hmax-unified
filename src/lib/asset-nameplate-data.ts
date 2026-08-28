/* ── Asset nameplate (factory specifications) ────────────────────── */

export interface Nameplate {
  manufacturer: string;
  manufactureYear: string;
  serial: string;
  ratedPower: string;     // e.g. "40 MVA"
  voltageRatings: string; // HV / LV
  frequency: string;
  coolingClass: string;
  tempRise: string;       // thermal limit
  impedance: string;
  insulationClass: string;
}

export const ASSET_NAMEPLATE: Record<string, Nameplate> = {
  "ast-001": {
    manufacturer: "Hitachi Energy",
    manufactureYear: "2009",
    serial: "TR-40A-0091",
    ratedPower: "40 MVA",
    voltageRatings: "138 / 13.8 kV",
    frequency: "60 Hz",
    coolingClass: "ONAN / ONAF",
    tempRise: "65 °C",
    impedance: "10.5 %",
    insulationClass: "Class A",
  },
  "ast-002": {
    manufacturer: "Hitachi Energy",
    manufactureYear: "2011",
    serial: "TR-40A-0114",
    ratedPower: "40 MVA",
    voltageRatings: "138 / 13.8 kV",
    frequency: "60 Hz",
    coolingClass: "ONAN / ONAF",
    tempRise: "65 °C",
    impedance: "10.4 %",
    insulationClass: "Class A",
  },
  "ast-003": {
    manufacturer: "Hitachi Energy",
    manufactureYear: "2013",
    serial: "TR-25B-0203",
    ratedPower: "25 MVA",
    voltageRatings: "69 / 13.8 kV",
    frequency: "60 Hz",
    coolingClass: "ONAN",
    tempRise: "65 °C",
    impedance: "8.5 %",
    insulationClass: "Class A",
  },
  "ast-004": {
    manufacturer: "Hitachi Energy",
    manufactureYear: "2014",
    serial: "TR-25A-0241",
    ratedPower: "25 MVA",
    voltageRatings: "69 / 13.8 kV",
    frequency: "60 Hz",
    coolingClass: "ONAN",
    tempRise: "55 °C",
    impedance: "8.2 %",
    insulationClass: "Class A",
  },
};
