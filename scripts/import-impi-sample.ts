import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { XMLParser } from "fast-xml-parser";
import type { TrademarkRecord } from "../src/types/trademark";

interface ImpiXmlReport {
  mesrecepcion?: {
    idReporte?: string | number;
    expedientes?: {
      expediente?: ImpiXmlRecord | ImpiXmlRecord[];
    };
  };
}

interface ImpiXmlRecord {
  tipoSolicitudDesc?: string;
  expediente?: string | number;
  nombreInteresado?: string;
  denominacion?: string;
  tipoMarcaDesc?: string;
  fechaPresentacion?: string;
}

interface ImportOutput {
  source: {
    name: string;
    url: string;
    reportId: string;
    importedAt: string;
    rawRecordCount: number;
    sampledRecordCount: number;
  };
  limitations: string[];
  records: TrademarkRecord[];
}

const SOURCE_URL = "https://datosabiertos.impi.gob.mx/Descargas/SignosDistintivos.xml";
const DEFAULT_INPUT = "data/raw/SignosDistintivos.xml";
const DEFAULT_OUTPUT = "src/data/generated/impi-sample.json";
const DEFAULT_LIMIT = 50;

function getCliValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function cleanText(value: string | number | undefined, fallback: string): string {
  if (value === undefined || value === null) {
    return fallback;
  }

  const cleaned = String(value).replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

function mapStatus(tipoSolicitudDesc: string): TrademarkRecord["status"] {
  const normalized = tipoSolicitudDesc.toUpperCase();

  if (normalized.includes("REGISTRO") || normalized.includes("PUBLICACION")) {
    return "Pending";
  }

  return "Pending";
}

function mapImpiRecord(record: ImpiXmlRecord): TrademarkRecord | null {
  const name = cleanText(record.denominacion, "");

  if (!name) {
    return null;
  }

  const tipoSolicitudDesc = cleanText(record.tipoSolicitudDesc, "Unknown application type");
  const tipoMarcaDesc = cleanText(record.tipoMarcaDesc, "Unknown mark type");
  const fechaPresentacion = cleanText(record.fechaPresentacion, "Unknown filing date");

  return {
    name,
    niceClass: 0,
    status: mapStatus(tipoSolicitudDesc),
    owner: cleanText(record.nombreInteresado, "Unknown owner"),
    expedienteNumber: cleanText(record.expediente, "Unknown expediente"),
    goodsServicesDescription: `${tipoSolicitudDesc}. ${tipoMarcaDesc}. Filing date: ${fechaPresentacion}. Nice class and goods/services are not present in this open-data sample.`
  };
}

function main() {
  const inputPath = resolve(getCliValue("--input") ?? DEFAULT_INPUT);
  const outputPath = resolve(getCliValue("--output") ?? DEFAULT_OUTPUT);
  const limit = Number(getCliValue("--limit") ?? DEFAULT_LIMIT);

  const xml = readFileSync(inputPath, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true
  });
  const parsed = parser.parse(xml) as ImpiXmlReport;
  const report = parsed.mesrecepcion;
  const rawRecords = asArray(report?.expedientes?.expediente);
  const records = rawRecords.map(mapImpiRecord).filter((record): record is TrademarkRecord => Boolean(record));
  const sampleSize = Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT;
  const sampledRecords = records.slice(0, sampleSize);

  const output: ImportOutput = {
    source: {
      name: "IMPI Datos Abiertos - SignosDistintivos.xml",
      url: SOURCE_URL,
      reportId: cleanText(report?.idReporte, "Unknown report"),
      importedAt: new Date().toISOString(),
      rawRecordCount: rawRecords.length,
      sampledRecordCount: sampledRecords.length
    },
    limitations: [
      "This monthly open-data file does not include Nice class in the inspected sample.",
      "This monthly open-data file does not include current legal status in the inspected sample.",
      "This monthly open-data file does not include registration number in the inspected sample.",
      "This monthly open-data file does not include goods/services descriptions in the inspected sample.",
      "Records should still be verified in Acervo, MARCia, SIGA, or ViDoc before product decisions."
    ],
    records: sampledRecords
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Imported ${sampledRecords.length} of ${rawRecords.length} records from report ${output.source.reportId}.`);
  console.log(`Wrote ${outputPath}`);
}

main();
