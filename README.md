# Comparador Inmobiliario - Extractor y Normalizador de Datos

Este es un sistema robusto para descubrir empresas de construcción, extraer catálogos de modelos de casas (SIPS, prefabricadas, modulares) y normalizarlos para que puedan ser comparados.

## Requisitos
- Python 3.9+
- Instalar dependencias: `pip install -r requirements.txt`

## Uso por CLI
Puedes ejecutar el scraper desde la línea de comandos usando `main.py`:

```bash
python main.py --pais "Chile" --region "La Araucanía" --salida "csv+sqlite"
```

## Estructura
- `/core`: Lógica principal (normalización, almacenamiento, loggers).
- `/portals`: Adaptadores específicos de sitios web.
- `/schemas`: Modelos de datos de Pydantic.
- `/outputs`: Archivos generados (CSV, SQLite).

## Cómo agregar nuevos adaptadores/sitios
1. Crea un nuevo archivo en `portals/` (ej: `empresa_x_adapter.py`).
2. Hereda de `BaseSiteAdapter`.
3. Implementa los métodos `discover_model_urls`, `parse_company_info` y `parse_model_page`.
4. Importa y agrega el adaptador a la lista `adapters` en `main.py`.

## Limitaciones (MVP)
- El descubrimiento automático de URLs mediante buscadores requiere configuración de proxy o APIs como SerpApi para evitar bloqueos.
- La extracción de PDF está diseñada para una fase 3 posterior.
