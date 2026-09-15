# IMPI Data Access Strategy

## Purpose

This document records the first data-access decision for the Trademark Similarity Analyzer prototype.
The goal is to identify the safest and most practical path for moving from mock trademark data to
official Mexican trademark data.

## Current Finding

IMPI has official public search interfaces, including MARCia and Acervo de Marcas, but those systems
appear to be designed primarily for interactive public consultation. IMPI also publishes official
open-data resources, which are a better foundation for machine-readable ingestion when the available
datasets cover the product need.

## Access Routes

| Access route | Official? | What it is for | Suitable for automation or bulk use? |
| --- | --- | --- | --- |
| MARCia (`marcia.impi.gob.mx`) | Yes | Interactive trademark searches by name, logo, owner, representative, status, and related fields. | Primarily a public web search interface. No documented public MARCia API has been confirmed. |
| Acervo de Marcas (`acervomarcas.impi.gob.mx`) | Yes | IMPI's public trademark archive and search service. | Public consultation. No published API or bulk-access documentation has been confirmed. |
| IMPI Datos Abiertos (`datosabiertos.impi.gob.mx`) | Yes | Official downloadable/public datasets. | Best official route for programmatic ingestion where the published dataset covers the product need. |
| SIGA / Gaceta (`siga.impi.gob.mx`) | Yes | Official Industrial Property Gazette publications and historical records. | Useful as an authoritative publication source, though not necessarily a search API. |

## Recommended Source Priority

1. Use IMPI Datos Abiertos first.
   This is the cleanest source from a provenance and automation standpoint because it is explicitly
   published as open data.

2. Use MARCia as a search and verification reference.
   MARCia is useful for understanding user expectations and validating record-level details, but the
   project should not depend on undocumented MARCia backend endpoints without written authorization or
   confirmation from IMPI.

3. Use Acervo de Marcas as the freshest public reference.
   If Acervo is more current than MARCia, it should be treated as an important verification source.
   However, it should not automatically be treated as a bulk data API.

4. Use SIGA/Gaceta or ViDoc for documentary verification.
   These sources are useful when the product needs official publications or supporting documents rather
   than only structured search fields.

## Practical Conclusion

IMPI provides official public access through MARCia and Acervo de Marcas for individual trademark
searches. For machine-readable access, IMPI also operates an official Datos Abiertos portal and publishes
distinctive-sign data in XML/CSV formats.

No documented public API for MARCia or Acervo has been confirmed. Therefore, the safest implementation
path is to ingest IMPI's published open-data resources first and use MARCia, Acervo, SIGA, or ViDoc for
lookup and verification rather than relying on undocumented endpoints or large-scale scraping.

## Product Implication

The Next.js application should not store millions of trademarks or logo files directly in the frontend.
The production architecture should separate the UI from the data pipeline:

```text
IMPI official data sources
        ↓
Data importer / sync process
        ↓
Database and search index
        ↓
Similarity engine
        ↓
Next.js web application
```