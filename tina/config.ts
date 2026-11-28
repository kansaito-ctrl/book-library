import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: 'main',
  clientId: process.env.TINA_CLIENT_ID || 'your-client-id',
  token: process.env.TINA_TOKEN || 'your-token',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'books',
        label: 'Libros',
        path: 'src/data',
        format: 'json',
        match: {
          include: 'books',
        },
        fields: [
          { type: 'string', name: 'title', label: 'Título', required: true },
          { type: 'string', name: 'author', label: 'Autor', required: true },
          { type: 'string', name: 'genre', label: 'Género', required: true },
          { type: 'number', name: 'year', label: 'Año', required: true },
          { type: 'number', name: 'pages', label: 'Páginas', required: true },
          { type: 'string', name: 'isbn', label: 'ISBN', required: true },
          { type: 'string', name: 'cover', label: 'Portada (URL)', required: true },
          { type: 'string', name: 'description', label: 'Descripción corta', required: true },
          { type: 'rich-text', name: 'longDescription', label: 'Descripción larga', required: true },
          { type: 'boolean', name: 'available', label: 'Disponible', default: true },
          { type: 'boolean', name: 'featured', label: 'Destacado', default: false },
          { type: 'number', name: 'rating', label: 'Rating (0-5)', min: 0, max: 5, step: 0.1 },
        ],
      },
    ],
  },
});