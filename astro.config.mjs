import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://book-library.example.com',
  integrations: [tailwind()],
  output: 'static',
});