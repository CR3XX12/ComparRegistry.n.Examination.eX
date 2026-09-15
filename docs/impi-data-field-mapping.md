# IMPI Open Data Field Mapping

## Source

- Source name: IMPI Datos Abiertos - SignosDistintivos.xml
- Source URL: `https://datosabiertos.impi.gob.mx/Descargas/SignosDistintivos.xml`
- Local raw path: `data/raw/SignosDistintivos.xml`
- Generated sample path: `src/data/generated/impi-sample.json`

The source file downloaded during this spike is the monthly distinctive-sign XML feed from IMPI's
Datos Abiertos portal.

## Import Command

```powershell
npm.cmd run import:impi:sample
```

Optional arguments:

```powershell
npm.cmd run import:impi:sample -- --limit 100
npm.cmd run import:impi:sample -- --input data/raw/SignosDistintivos.xml --output src/data/generated/impi-sample.json
```

## Field Mapping

| Prototype field | IMPI XML field | Mapping status | Notes |
| --- | --- | --- | --- |
| `name` | `denominacion` | Direct | Main searchable trademark denomination. |
| `owner` | `nombreInteresado` | Direct | Represents the interested party in the monthly feed. |
| `expedienteNumber` | `expediente` | Direct | Main file/application identifier. |
| `status` | `tipoSolicitudDesc` | Partial | The monthly feed identifies application type, not final current legal status. Imported records are currently mapped as `Pending`. |
| `niceClass` | Not present in inspected sample | Missing | Imported records use `0` until a richer source is added. |
| `registrationNumber` | Not present in inspected sample | Missing | Not included in the inspected monthly feed. |
| `goodsServicesDescription` | `tipoSolicitudDesc`, `tipoMarcaDesc`, `fechaPresentacion` | Placeholder | The feed does not include goods/services text in the inspected sample, so the importer creates a descriptive placeholder. |

## Sample XML Shape

```xml
<expediente>
  <tipoSolicitudDesc>REGISTRO DE MARCA</tipoSolicitudDesc>
  <expediente>3676674</expediente>
  <nombreInteresado>ADLER PHARMA S. DE R.L. DE C.V.</nombreInteresado>
  <denominacion>ADBAC 7 VIAS</denominacion>
  <tipoMarcaDesc>NOMINATIVA</tipoMarcaDesc>
  <fechaPresentacion>2026-08-03T00:11:33-05:00</fechaPresentacion>
</expediente>
```

## Spike Conclusion So Far

The monthly IMPI open-data XML can provide real trademark names and expediente numbers for testing the
similarity engine. However, the inspected sample is not enough by itself to fully replace the mock data
because it does not expose Nice class, current legal status, registration number, or goods/services text.

The next implementation step should be to load the generated sample in a separate prototype mode or build
a small backend/search layer that can combine this source with richer verification sources.
