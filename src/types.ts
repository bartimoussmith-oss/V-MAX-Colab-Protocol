
export enum ThreatLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  CRITICAL = "CRITICAL"
}

export interface ArrestRecord {
  id: string;
  name: string;
  charges: string;
  residence: string;
  incidentDate: Date;
  year: number;
  threatLevel: string;
  arrestCount: number;
  isCurrentTarget: boolean;
  lat: number;
  lon: number;
  visualMass: number;
}
