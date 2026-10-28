# Registro de sesiones

## Cómo levantar el proyecto

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
npm test
```

En el CMD de Windows, el primer comando es `copy .env.example .env` (en PowerShell y Git Bash funciona `cp`).

## Decisiones

- **Fecha:** el formulario envía solo un día (`2026-10-15`), sin hora, pero la columna `date` es `DateTime` y guarda un instante exacto. Por eso el día se guarda a las 00:00 UTC (`2026-10-15T00:00:00Z`) y, al mostrarlo, se vuelve a leer en UTC. Al guardar y leer en la misma zona, se muestra siempre el día ingresado. Si se leyera en hora de Chile (UTC-3), las 00:00 UTC del 15 serían las 21:00 del 14 y la sesión aparecería un día antes. Además del formato `YYYY-MM-DD`, se comprueba que el día exista: `2026-02-30` se rechaza en vez de convertirse en el 2 de marzo.
- **Notas vacías:** se recortan los espacios y, si quedan vacías o no vienen, se guardan como `null`, para que "sin notas" tenga una sola representación.
- **Schema:** dividido en un archivo por modelo en `prisma/schema/` (ruta configurada en `package.json`), junto con las migraciones.
- **Tema y duración:** el tema se recorta antes de validar su largo, así que uno con solo espacios cuenta como vacío. La duración solo acepta dígitos, para rechazar valores como `"15.5"` o `"1e2"` antes de convertirlos a número.
- **Validación en el servidor:** el formulario usa `noValidate` para que el navegador no bloquee el envío y todos los errores vengan de Zod en el Server Action.
- **Ids y orden:** los ids son UUID v7, no secuenciales; un id con formato inválido o inexistente responde 404. Las sesiones se ordenan por fecha descendente, con `createdAt` como desempate.
- **Variables de entorno:** `.env.example` trae la única variable necesaria (la ruta de SQLite); se copia a `.env`, que no se versiona.
