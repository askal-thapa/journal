(function () {
    // Enhanced copy functionality for individual articles
    async function copyArticleToClipboard(articleEl) {
        if (!articleEl) throw new Error('No article element provided');
        
        const h2 = articleEl.querySelector('h2')?.textContent.trim() || '';
        const date = articleEl.querySelector('p')?.textContent.trim() || '';
        const lists = Array.from(articleEl.querySelectorAll('.reflection-list')).map(l => l.textContent.trim()).filter(Boolean);
        const paras = Array.from(articleEl.querySelectorAll('p')).map(p => p.textContent.trim()).filter(t => t && t !== date);
        const other = Array.from(articleEl.querySelectorAll('h3, h4, div')).map(n => n.textContent.trim()).filter(Boolean);
        const content = [ ...paras, ...lists, ...other ].join('\n\n');
        const text = [h2.replace(/\d+\s*min\s*read/g, '').trim(), date, '', content].filter(Boolean).join('\n\n');
        
        if (navigator.clipboard && navigator.clipboard.writeText) { 
            await navigator.clipboard.writeText(text); 
            return true; 
        }
        
        // Fallback for older browsers
        const ta = document.createElement('textarea'); 
        ta.value = text; 
        document.body.appendChild(ta); 
        ta.select();
        try { 
            document.execCommand('copy'); 
            document.body.removeChild(ta); 
            return true; 
        } catch (e) { 
            document.body.removeChild(ta); 
            throw e; 
        }
    }

    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const articles = document.querySelectorAll('.week-entry');
            
            articles.forEach(article => {
                const content = article.textContent.toLowerCase();
                if (content.includes(searchTerm)) {
                    article.style.display = 'block';
                    article.classList.add('fade-in');
                } else {
                    article.style.display = 'none';
                    article.classList.remove('fade-in');
                }
            });

            // Show no results message
            const visibleArticles = Array.from(articles).filter(a => a.style.display !== 'none');
            let noResults = document.getElementById('no-results');
            
            if (visibleArticles.length === 0 && searchTerm.length > 0) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.id = 'no-results';
                    noResults.className = 'no-results';
                    noResults.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #777;">
                            <h3>No entries found</h3>
                            <p>Try searching for different keywords like "JavaScript", "CSS", or "mobile"</p>
                        </div>
                    `;
                    searchInput.parentNode.parentNode.appendChild(noResults);
                }
                noResults.style.display = 'block';
            } else if (noResults) {
                noResults.style.display = 'none';
            }
        });
    }

    // Progress animation
    function animateProgress() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }, index * 200);
        });
    }

    // Reading time calculation
    function calculateReadingTime() {
        const articles = document.querySelectorAll('.week-entry');
        articles.forEach(article => {
            const text = article.textContent;
            const wordCount = text.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // Average reading speed
            
            const badge = article.querySelector('.reading-time');
            if (badge && !badge.textContent.includes('min read')) {
                badge.textContent = `${readingTime} min read`;
            }
        });
    }

    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add copy buttons to each article
            const articles = Array.from(document.querySelectorAll('.week-entry'));
            articles.forEach(article => {
                if (article.querySelector('.entry-copy-btn')) return;
                
                const btn = document.createElement('button'); 
                btn.type = 'button'; 
                btn.className = 'entry-copy-btn'; 
                btn.innerHTML = '📋 Copy';
                btn.setAttribute('aria-label', 'Copy this entry to clipboard');
                
                article.appendChild(btn);
                
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try { 
                        await copyArticleToClipboard(article); 
                        const originalContent = btn.innerHTML;
                        btn.innerHTML = '✅ Copied!'; 
                        btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                        setTimeout(() => {
                            btn.innerHTML = originalContent;
                            btn.style.background = '';
                        }, 2000); 
                    }
                    catch (err) { 
                        console.error('Article copy failed', err); 
                        const originalContent = btn.innerHTML;
                        btn.innerHTML = '❌ Failed'; 
                        btn.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                        setTimeout(() => {
                            btn.innerHTML = originalContent;
                            btn.style.background = '';
                        }, 2000); 
                    }
                });
            });

            // Initialize other features
            setupSearch();
            calculateReadingTime();
            
            // Animate progress bars after a short delay
            setTimeout(animateProgress, 500);
        });
    }

    // Export functions for global access
    window.JournalBrowser = { 
        copyArticleToClipboard, 
        setupSearch, 
        animateProgress,
        calculateReadingTime,
        init 
    };
    
    init();
})();
