export interface Mantenimiento {
  id_mantenimiento?: number;
  MEMO?: string;
  TIPO_NRO_PROC?: string;
  OBJETO?: string;
  APIA?: string;
  RESOLUCION?: string;
  MONTO_INICIADO?: number;
  EMPRESA?: string;
  MONTO_FINAL?: number;
  INICIO?: string; // Date as string for API compatibility
  FIN?: string; // Date as string for API compatibility
  DURACION?: string;
  PERIODICIDAD?: string;
  OBS?: string;
  DATOS_RELEVANTES?: string;
  PRORROGA?: boolean;
  ES_PRORROGA?: boolean; // Indica si este mantenimiento fue creado como prórroga
  BIBLORATO?: number; // Nuevo campo para agrupación
}

export interface MantenimientoFormData {
  MEMO: string;
  TIPO_NRO_PROC: string;
  OBJETO: string;
  APIA: string;
  RESOLUCION: string;
  MONTO_INICIADO: number | null;
  EMPRESA: string;
  MONTO_FINAL: number | null;
  INICIO: string;
  FIN: string;
  DURACION: string;
  PERIODICIDAD: string;
  OBS: string;
  DATOS_RELEVANTES: string;
  PRORROGA: boolean;
  BIBLORATO: number | null;
}
