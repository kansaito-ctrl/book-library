# TinaCMS Setup para BiblioEscuela

## Requisitos previos
- Cuenta en [TinaCMS](https://tina.io) (gratis para proyectos personales)
- Repositorio en GitHub

## Configuración

### 1. Crear proyecto en TinaCMS
1. Ve a https://tina.io y crea cuenta
2. "New Project" → Conecta tu repo GitHub `kansaito-ctrl/book-library`
3. Copia **Client ID** y **Token**

### 2. Variables de entorno
Crea `.env` en la raíz del proyecto:
```env
TINA_CLIENT_ID=tu-client-id
TINA_TOKEN=tu-token
```

### 3. Instalar dependencias
```bash
npm install tinacms @tinacms/cli @tinacms/auth @tinacms/search react react-dom @tinacms/forms @tinacms/toolkit
```

### 4. Desarrollo local
```bash
# Terminal 1: Astro dev
npm run dev

# Terminal 2: TinaCMS dev
npx tinacms dev -c "npm run dev"
```

### 5. Acceder al panel
- Abre http://localhost:4321/admin
- Edita libros visualmente
- Los cambios se guardan en `src/data/books.json` y commitean a Git

## Estructura de datos (books.json)
El schema en `tina/config.ts` define:
- title, author, genre, year, pages, isbn
- cover (URL), description, longDescription
- available, featured, rating

## Despliegue en Vercel
1. En Vercel Dashboard → Settings → Environment Variables
2. Añade `TINA_CLIENT_ID` y `TINA_TOKEN`
3. Redeploy

## Notas
- TinaCMS solo funciona en desarrollo local y en producción con las credenciales correctas
- Los cambios se guardan como commits en Git
- Para producción real, considerar base de datos (Turso/SQLite) + API