// Search Functionality for FusionFields

// Article data for search
const articlesData = [
    {
        id: 'anti-aging-skincare',
        title: 'Ultimate Anti-Aging Skincare Routine for Your 30s',
        category: 'beauty',
        categoryName: 'Health & Beauty',
        author: 'Dr. Emily Chen',
        date: 'February 28, 2025',
        readTime: '12 min read',
        views: '4.1K views',
        image: 'images/护肤品.png',
        url: 'articles/anti-aging-skincare.html',
        excerpt: 'Your 30s mark a pivotal time for skincare as collagen production begins to slow down and the first signs of aging become more apparent. Establishing a comprehensive anti-aging routine now can help maintain youthful, radiant skin for years to come.',
        tags: ['Anti-Aging', 'Skincare Routine', 'Retinol', 'Vitamin C', '30s Skincare'],
        content: 'skincare routine anti-aging retinol vitamin c collagen production skin care dermatology beauty health'
    },
    {
        id: 'nyc-fine-dining',
        title: 'Best Fine Dining Restaurants in New York: A Culinary Journey',
        category: 'food',
        categoryName: 'Food & Beverages',
        author: 'Chef Isabella Rodriguez',
        date: 'July 22, 2025',
        readTime: '10 min read',
        views: '6.7K views',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        url: 'articles/nyc-fine-dining.html',
        excerpt: 'New York City stands as the undisputed culinary capital of America, home to some of the world\'s most celebrated restaurants and innovative chefs.',
        tags: ['Fine Dining', 'New York Restaurants', 'Michelin Stars', 'Culinary Experience', 'Food Review'],
        content: 'fine dining restaurants new york michelin stars culinary experience food review dining cuisine chef'
    },
    {
        id: 'scandinavian-design',
        title: 'Scandinavian Design Trends That Transform Any Space',
        category: 'home',
        categoryName: 'Home & Garden',
        author: 'Marcus Andersson',
        date: 'January 20, 2025',
        readTime: '10 min read',
        views: '3.8K views',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        url: 'articles/scandinavian-design.html',
        excerpt: 'Scandinavian design has captivated homeowners worldwide with its emphasis on simplicity, functionality, and connection to nature.',
        tags: ['Scandinavian Design', 'Interior Design', 'Minimalism', 'Home Decor', 'Nordic Style'],
        content: 'scandinavian design interior design minimalism home decor nordic style furniture lighting hygge'
    },
    {
        id: 'smart-home-tech',
        title: 'Smart Home Technology That Actually Makes Life Easier',
        category: 'home',
        categoryName: 'Home & Garden',
        author: 'Alex Thompson',
        date: 'June 5, 2025',
        readTime: '8 min read',
        views: '4.9K views',
        image: 'images/家居.png',
        url: 'articles/smart-home-tech.html',
        excerpt: 'Smart home technology has evolved from futuristic novelty to practical necessity, offering real solutions that enhance comfort, security, and efficiency.',
        tags: ['Smart Home', 'Home Automation', 'Technology', 'IoT Devices', 'Home Security'],
        content: 'smart home technology automation iot devices security lighting thermostat voice assistant'
    },
    {
        id: 'sustainable-fashion',
        title: 'The Rise of Sustainable Fashion: 10 Brands Leading the Change',
        category: 'fashion',
        categoryName: 'Fashion & Accessories',
        author: 'Sarah Johnson',
        date: 'March 15, 2025',
        readTime: '8 min read',
        views: '2.3K views',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        url: 'articles/sustainable-fashion.html',
        excerpt: 'The fashion industry is undergoing a revolutionary transformation as consumers become increasingly conscious of environmental impact and ethical manufacturing practices.',
        tags: ['Sustainable Fashion', 'Eco-Friendly', 'Ethical Manufacturing', 'Organic Materials', 'Fashion Brands'],
        content: 'sustainable fashion eco-friendly ethical manufacturing organic materials fashion brands environment'
    },
    {
        id: 'travel-insurance',
        title: 'Complete Guide to Travel Insurance: What You Need to Know',
        category: 'finance',
        categoryName: 'Finance & Insurance',
        author: 'James Mitchell',
        date: 'August 10, 2025',
        readTime: '7 min read',
        views: '5.2K views',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        url: 'articles/travel-insurance.html',
        excerpt: 'Travel insurance might seem like an unnecessary expense when you\'re planning your dream vacation, but it can be the difference between a minor inconvenience and a financial disaster.',
        tags: ['Travel Insurance', 'Travel Tips', 'Insurance Coverage', 'Emergency Coverage', 'Travel Safety'],
        content: 'travel insurance travel tips insurance coverage emergency coverage travel safety financial protection'
    }
];

// Search functionality
class SearchEngine {
    constructor() {
        this.results = [];
        this.currentQuery = '';
        this.currentFilters = {
            category: '',
            sortBy: 'relevance'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSearchFromURL();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortBy = document.getElementById('sortBy');

        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.currentFilters.category = categoryFilter.value;
                this.performSearch();
            });
        }

        if (sortBy) {
            sortBy.addEventListener('change', () => {
                this.currentFilters.sortBy = sortBy.value;
                this.performSearch();
            });
        }

        // Suggestion tags
        document.querySelectorAll('.tag[data-search]').forEach(tag => {
            tag.addEventListener('click', () => {
                const searchTerm = tag.getAttribute('data-search');
                searchInput.value = searchTerm;
                this.performSearch();
            });
        });
    }

    loadSearchFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const category = urlParams.get('category');
        const sort = urlParams.get('sort');

        if (query) {
            document.getElementById('searchInput').value = query;
            this.currentQuery = query;
        }

        if (category) {
            document.getElementById('categoryFilter').value = category;
            this.currentFilters.category = category;
        }

        if (sort) {
            document.getElementById('sortBy').value = sort;
            this.currentFilters.sortBy = sort;
        }

        if (query) {
            this.performSearch();
        }
    }

    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput ? searchInput.value.trim() : this.currentQuery;

        if (!query) {
            this.showNoResults();
            return;
        }

        this.currentQuery = query;
        this.updateURL();
        this.searchArticles(query);
        this.displayResults();
    }

    searchArticles(query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        this.results = articlesData.filter(article => {
            // Category filter
            if (this.currentFilters.category && article.category !== this.currentFilters.category) {
                return false;
            }

            // Search in title, excerpt, tags, and content
            const searchableText = [
                article.title,
                article.excerpt,
                article.content,
                ...article.tags
            ].join(' ').toLowerCase();

            // Check if all search terms are found
            return searchTerms.every(term => searchableText.includes(term));
        });

        // Calculate relevance scores
        this.results.forEach(article => {
            article.relevanceScore = this.calculateRelevance(article, searchTerms);
        });

        // Sort results
        this.sortResults();
    }

    calculateRelevance(article, searchTerms) {
        let score = 0;
        const title = article.title.toLowerCase();
        const excerpt = article.excerpt.toLowerCase();
        const content = article.content.toLowerCase();

        searchTerms.forEach(term => {
            // Title matches get highest score
            if (title.includes(term)) score += 10;
            
            // Excerpt matches get medium score
            if (excerpt.includes(term)) score += 5;
            
            // Content matches get lower score
            if (content.includes(term)) score += 1;
            
            // Tag matches get medium-high score
            article.tags.forEach(tag => {
                if (tag.toLowerCase().includes(term)) score += 3;
            });
        });

        return score;
    }

    sortResults() {
        switch (this.currentFilters.sortBy) {
            case 'relevance':
                this.results.sort((a, b) => b.relevanceScore - a.relevanceScore);
                break;
            case 'date':
                this.results.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'title':
                this.results.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }

    displayResults() {
        const resultsContainer = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        const searchQuery = document.getElementById('searchQuery');
        const resultsCount = document.getElementById('resultsCount');

        if (this.results.length === 0) {
            resultsContainer.innerHTML = '';
            noResults.style.display = 'block';
            if (searchQuery) searchQuery.textContent = `"${this.currentQuery}"`;
            if (resultsCount) resultsCount.textContent = '0 results found';
            return;
        }

        noResults.style.display = 'none';
        
        if (searchQuery) searchQuery.textContent = `"${this.currentQuery}"`;
        if (resultsCount) resultsCount.textContent = `${this.results.length} result${this.results.length === 1 ? '' : 's'} found`;

        resultsContainer.innerHTML = this.results.map(article => this.createResultHTML(article)).join('');
    }

    createResultHTML(article) {
        return `
            <article class="search-result-item">
                <div class="result-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <div class="result-content">
                    <div class="result-meta">
                        <span class="result-category">${article.categoryName}</span>
                        <span class="result-date">${article.date}</span>
                    </div>
                    <h3 class="result-title">
                        <a href="${article.url}">${this.highlightSearchTerms(article.title)}</a>
                    </h3>
                    <p class="result-excerpt">${this.highlightSearchTerms(article.excerpt)}</p>
                    <div class="result-details">
                        <span class="result-author">By ${article.author}</span>
                        <span class="result-read-time">${article.readTime}</span>
                        <span class="result-views">${article.views}</span>
                    </div>
                    <div class="result-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `;
    }

    highlightSearchTerms(text) {
        if (!this.currentQuery) return text;
        
        const searchTerms = this.currentQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        let highlightedText = text;
        
        searchTerms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }

    showNoResults() {
        const resultsContainer = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        const searchQuery = document.getElementById('searchQuery');
        const resultsCount = document.getElementById('resultsCount');

        resultsContainer.innerHTML = '';
        noResults.style.display = 'block';
        
        if (searchQuery) searchQuery.textContent = `"${this.currentQuery}"`;
        if (resultsCount) resultsCount.textContent = '0 results found';
    }

    updateURL() {
        const url = new URL(window.location);
        url.searchParams.set('q', this.currentQuery);
        if (this.currentFilters.category) {
            url.searchParams.set('category', this.currentFilters.category);
        }
        if (this.currentFilters.sortBy !== 'relevance') {
            url.searchParams.set('sort', this.currentFilters.sortBy);
        }
        window.history.pushState({}, '', url);
    }
}

// Enhanced search functionality for main.js
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Determine the correct path to search-results.html based on current location
        let searchResultsPath = 'search-results.html';
        
        // If we're in articles or categories folder, need to go up one level
        if (window.location.pathname.includes('/articles/') || window.location.pathname.includes('/categories/')) {
            searchResultsPath = '../search-results.html';
        }
        
        // Simple redirect with query parameter
        window.location.href = searchResultsPath + '?q=' + encodeURIComponent(query);
    }
}

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the search results page
    if (window.location.pathname.includes('search-results.html')) {
        new SearchEngine();
    }
});

// Search suggestions functionality
function initSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;

    let suggestionsContainer = null;
    let currentSuggestions = [];

    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length < 2) {
            hideSuggestions();
            return;
        }

        const suggestions = getSearchSuggestions(query);
        showSuggestions(suggestions);
    });

    searchInput.addEventListener('blur', function() {
        // Delay hiding to allow clicking on suggestions
        setTimeout(hideSuggestions, 200);
    });

    function getSearchSuggestions(query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();

        // Get suggestions from article titles and tags
        articlesData.forEach(article => {
            if (article.title.toLowerCase().includes(queryLower)) {
                suggestions.push({
                    text: article.title,
                    type: 'title',
                    url: article.url
                });
            }

            article.tags.forEach(tag => {
                if (tag.toLowerCase().includes(queryLower)) {
                    suggestions.push({
                        text: tag,
                        type: 'tag',
                        url: null
                    });
                }
            });
        });

        // Remove duplicates and limit to 5
        const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
            index === self.findIndex(s => s.text === suggestion.text)
        ).slice(0, 5);

        return uniqueSuggestions;
    }

    function showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            hideSuggestions();
            return;
        }

        if (!suggestionsContainer) {
            createSuggestionsContainer();
        }

        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-text="${suggestion.text}">
                <i class="fas fa-${suggestion.type === 'title' ? 'file-alt' : 'tag'}"></i>
                <span>${suggestion.text}</span>
            </div>
        `).join('');

        // Add click handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const text = this.getAttribute('data-text');
                searchInput.value = text;
                hideSuggestions();
                performSearch();
            });
        });

        suggestionsContainer.style.display = 'block';
    }

    function hideSuggestions() {
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    function createSuggestionsContainer() {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        `;

        const searchContainer = searchInput.closest('.search-container');
        if (searchContainer) {
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(suggestionsContainer);
        }
    }
}

// Export for use in main.js
window.SearchEngine = SearchEngine;
window.performSearch = performSearch;
window.initSearchSuggestions = initSearchSuggestions;
