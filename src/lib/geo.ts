// Georgian cadastral codes encode region in first 2 digits.
// This maps cadastral prefixes to approximate center coordinates.
const CADASTRAL_REGIONS: Record<string, { lat: number; lng: number; name: string }> = {
  "01": { lat: 41.7151, lng: 44.8271, name: "Tbilisi" },
  "05": { lat: 41.6168, lng: 41.6367, name: "Batumi/Adjara" },
  "06": { lat: 42.2679, lng: 42.7180, name: "Kutaisi/Imereti" },
  "10": { lat: 41.5500, lng: 44.9500, name: "Rustavi" },
  "11": { lat: 41.9816, lng: 44.1135, name: "Gori" },
  "26": { lat: 41.8433, lng: 44.7183, name: "Mtskheta" },
  "29": { lat: 41.9244, lng: 45.3622, name: "Telavi" },
  "38": { lat: 41.6400, lng: 43.0000, name: "Borjomi" },
  "43": { lat: 42.5088, lng: 41.8709, name: "Zugdidi" },
  "51": { lat: 41.9816, lng: 44.1135, name: "Shida Kartli" },
  "64": { lat: 42.1597, lng: 42.4431, name: "Tskaltubo" },
};

// Get approximate coordinates from cadastral code prefix.
export function cadastralToCoords(cadastral?: string): { lat: number; lng: number } | null {
  if (!cadastral) return null;
  // Cadastral format: XX.XX.XX.XXX.XXX or XXXXXXXXXXXX
  const prefix = cadastral.replace(/\./g, "").substring(0, 2);
  return CADASTRAL_REGIONS[prefix] || null;
}

// Build a link to view the parcel on NAPR public registry map.
export function cadastralMapUrl(cadastral: string): string {
  return `https://maps.napr.gov.ge/?cadastral=${encodeURIComponent(cadastral)}`;
}

// Google Maps search URL from address parts.
export function googleMapsUrl(lat?: number, lng?: number, address?: string): string {
  if (lat && lng) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  if (address) {
    return `https://www.google.com/maps/search/${encodeURIComponent(address + ", Georgia")}`;
  }
  return "#";
}
