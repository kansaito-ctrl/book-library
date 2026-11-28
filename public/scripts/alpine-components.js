// alpine-components.js - Registro global de componentes Alpine.js
// Este script se ejecuta ANTES de cargar Alpine.js

// Theme Toggle Component
function themeToggle() {
  return {
    isDark: false,
    init() {
      this.isDark = document.documentElement.classList.contains('dark');
    },
    toggle() {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle('dark', this.isDark);
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }
  };
}

// Search Filter Component
function searchFilter() {
  return {
    searchQuery: '',
    selectedGenre: '',
    sortBy: 'relevance',
    genres: [],
    allBooks: [],
    filteredBooks: [],
    isFiltering: false,
    resultsContainer: null,
    skeletonContainer: null,
    init() {
      this.resultsContainer = document.getElementById('books-grid');
      this.skeletonContainer = document.getElementById('skeleton-grid');
      if (this.resultsContainer) {
        this.allBooks = JSON.parse(this.resultsContainer.dataset.books || '[]');
        this.filteredBooks = [...this.allBooks];
      }
      // Leer géneros del select en el DOM
      const genreSelect = document.getElementById('genre-select');
      if (genreSelect) {
        this.genres = Array.from(genreSelect.options)
          .map(opt => opt.value)
          .filter(v => v !== '');
      }
      const params = new URLSearchParams(window.location.search);
      this.searchQuery = params.get('q') || '';
      this.selectedGenre = params.get('genre') || '';
      this.sortBy = params.get('sort') || 'relevance';
      this.filterBooks();
    },
    filterBooks() {
      this.showSkeletons();
      setTimeout(() => {
        let results = [...this.allBooks];
        if (this.searchQuery.trim()) {
          const query = this.searchQuery.toLowerCase().trim();
          results = results.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.isbn?.includes(query) ||
            book.genre.toLowerCase().includes(query)
          );
        }
        if (this.selectedGenre) {
          results = results.filter(book => book.genre === this.selectedGenre);
        }
        results = this.sortBooks(results);
        this.filteredBooks = results;
        this.updateURL();
        this.renderResults();
        this.updateResultsText();
        this.hideSkeletons();
      }, 500);
    },
    showSkeletons() {
      this.isFiltering = true;
      if (this.resultsContainer) this.resultsContainer.classList.add('hidden');
      if (this.skeletonContainer) this.skeletonContainer.classList.remove('hidden');
    },
    hideSkeletons() {
      this.isFiltering = false;
      if (this.resultsContainer) this.resultsContainer.classList.remove('hidden');
      if (this.skeletonContainer) this.skeletonContainer.classList.add('hidden');
    },
    sortBooks(books) {
      const sorted = [...books];
      switch (this.sortBy) {
        case 'title-asc': return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc': return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case 'author-asc': return sorted.sort((a, b) => a.author.localeCompare(b.author));
        case 'year-desc': return sorted.sort((a, b) => b.year - a.year);
        case 'year-asc': return sorted.sort((a, b) => a.year - b.year);
        case 'rating-desc': return sorted.sort((a, b) => b.rating - a.rating);
        default: return sorted;
      }
    },
    renderResults() {
      if (!this.resultsContainer) return;
      if (this.filteredBooks.length === 0) {
        this.resultsContainer.innerHTML = '';
        return;
      }
      this.resultsContainer.innerHTML = this.filteredBooks.map(book => `
        <article class="card group h-full flex flex-col" aria-labelledby="book-title-${book.id}">
          <div class="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img src="${book.cover}" alt="" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width="300" height="450" />
            <div class="absolute top-3 right-3">
              <span class="${book.available ? 'badge badge-available' : 'badge badge-unavailable'}">${book.available ? 'Disponible' : 'Prestado'}</span>
            </div>
          </div>
          <div class="p-4 md:p-5 flex flex-col flex-1">
            <span class="badge badge-genre mb-3 inline-block">${book.genre}</span>
            <h3 id="book-title-${book.id}" class="font-display text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <a href="/libro/${book.slug}" class="hover:underline">${book.title}</a>
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center gap-1">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span class="line-clamp-1">${book.author}</span>
            </p>
            <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>${book.year}</span>
              <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>${book.pages} p.</span>
              <span class="flex items-center gap-1 text-amber-500" aria-label="Valoración: ${book.rating} de 5 estrellas"><svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${book.rating}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">${book.description}</p>
            <div class="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
              <a href="/libro/${book.slug}" class="btn-secondary w-full text-center">Ver detalles</a>
            </div>
          </div>
        </article>
      `).join('');
    },
    updateResultsText() {
      const el = document.querySelector('[x-text="resultsText"]');
      if (el) {
        const total = this.allBooks.length;
        const showing = this.filteredBooks.length;
        if (this.hasActiveFilters) {
          el.textContent = `Mostrando ${showing} de ${total} libros`;
        } else {
          el.textContent = `${total} libros en el catálogo`;
        }
      }
    },
    updateURL() {
      const params = new URLSearchParams();
      if (this.searchQuery) params.set('q', this.searchQuery);
      if (this.selectedGenre) params.set('genre', this.selectedGenre);
      if (this.sortBy !== 'relevance') params.set('sort', this.sortBy);
      const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newURL);
    },
    clearFilters() {
      this.searchQuery = '';
      this.selectedGenre = '';
      this.sortBy = 'relevance';
      this.filterBooks();
    },
    get hasActiveFilters() {
      return this.searchQuery.trim() !== '' || this.selectedGenre !== '';
    },
    get resultsText() {
      const total = this.allBooks.length;
      const showing = this.filteredBooks.length;
      if (this.hasActiveFilters) return `Mostrando ${showing} de ${total} libros`;
      return `${total} libros en el catálogo`;
    }
  };
}

// Favorite Button Component
function favoriteButton() {
  return {
    isFavorite: false,
    init() {
      const article = this.$el.closest('article');
      const link = article?.querySelector('h3 a');
      if (link) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.isFavorite = favorites.includes(link.href);
      }
    },
    toggle(event) {
      event.preventDefault();
      event.stopPropagation();
      const article = this.$el.closest('article');
      const link = article?.querySelector('h3 a');
      if (!link) return;
      const bookUrl = link.href;
      const bookTitle = link.textContent.trim();
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const index = favorites.indexOf(bookUrl);
      if (index > -1) {
        favorites.splice(index, 1);
        this.isFavorite = false;
        this.showToast(`${bookTitle} eliminado de favoritos`, 'info');
      } else {
        favorites.push(bookUrl);
        this.isFavorite = true;
        this.showToast(`${bookTitle} añadido a favoritos`, 'success');
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = `toast toast-${type} pointer-events-auto`;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `<span>${message}</span><button type="button" class="ml-4 text-white/80 hover:text-white transition-opacity" aria-label="Cerrar"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>`;
      toast.querySelector('button').addEventListener('click', () => { toast.classList.add('animate-slide-out'); setTimeout(() => toast.remove(), 200); });
      container.appendChild(toast);
      setTimeout(() => { if (toast.parentElement) { toast.classList.add('animate-slide-out'); setTimeout(() => toast.remove(), 200); } }, 4000);
    }
  };
}

// Registrar componentes en Alpine
document.addEventListener('alpine:init', () => {
  Alpine.data('themeToggle', themeToggle);
  Alpine.data('searchFilter', searchFilter);
  Alpine.data('favoriteButton', favoriteButton);
});