// 巴梦科技博客 - 交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // 这里可以添加实际的搜索逻辑
            // 例如：过滤文章、跳转到搜索结果页等
            alert(`搜索: "${query}"\n\n搜索功能已准备就绪，可以集成后端API或静态搜索。`);
            
            // 模拟搜索效果
            highlightSearchTerms(query);
        } else {
            alert('请输入搜索关键词');
            searchInput.focus();
        }
    }
    
    function highlightSearchTerms(query) {
        const articles = document.querySelectorAll('.article-card-title, .article-card-excerpt');
        const searchTerms = query.toLowerCase().split(' ');
        
        articles.forEach(element => {
            let originalHTML = element.innerHTML;
            let highlightedHTML = originalHTML;
            
            searchTerms.forEach(term => {
                if (term.length > 2) {
                    const regex = new RegExp(`(${term})`, 'gi');
                    highlightedHTML = highlightedHTML.replace(regex, '<mark class="search-highlight">$1</mark>');
                }
            });
            
            if (highlightedHTML !== originalHTML) {
                element.innerHTML = highlightedHTML;
                
                // 滚动到第一个高亮结果
                const firstHighlight = element.querySelector('.search-highlight');
                if (firstHighlight) {
                    firstHighlight.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
        
        // 添加高亮样式
        if (!document.querySelector('#search-highlight-style')) {
            const style = document.createElement('style');
            style.id = 'search-highlight-style';
            style.textContent = `
                .search-highlight {
                    background: linear-gradient(120deg, var(--accent-orange) 0%, #ff9a5c 100%);
                    color: white;
                    padding: 0.1rem 0.3rem;
                    border-radius: 3px;
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 文章卡片点击效果
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果不是点击链接，则模拟点击第一个链接
            if (!e.target.closest('a')) {
                const link = this.querySelector('.article-card-link');
                if (link) {
                    // 在实际应用中，这里会跳转到文章页面
                    // 现在只是演示效果
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                        alert('文章页面功能已准备就绪\n可以创建 article.html 模板来展示完整文章');
                    }, 150);
                }
            }
        });
    });
    
    // 分类过滤功能
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.querySelector('.category-name').textContent;
            
            // 移除其他分类的活动状态
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // 过滤文章
            filterArticlesByCategory(category);
        });
    });
    
    function filterArticlesByCategory(category) {
        const allArticles = document.querySelectorAll('.article-card');
        let visibleCount = 0;
        
        allArticles.forEach(article => {
            const articleCategory = article.querySelector('.article-category-tag')?.textContent || '';
            const isMatch = category === '全部' || articleCategory === category;
            
            if (isMatch) {
                article.style.display = 'flex';
                visibleCount++;
                
                // 添加显示动画
                article.style.animation = 'fadeIn 0.5s ease';
            } else {
                article.style.display = 'none';
            }
        });
        
        // 显示过滤结果
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'filter-results';
        resultsInfo.innerHTML = `
            <div style="background: var(--light-gray); padding: 1rem; border-radius: var(--radius-md); margin: 1rem 0;">
                <strong>${category}</strong> 分类下有 <strong>${visibleCount}</strong> 篇文章
                <button class="clear-filter" style="margin-left: 1rem; background: none; border: none; color: var(--accent-blue); cursor: pointer;">
                    清除过滤
                </button>
            </div>
        `;
        
        // 移除之前的结果信息
        const oldInfo = document.querySelector('.filter-results');
        if (oldInfo) oldInfo.remove();
        
        // 插入到文章网格前
        const articlesGrid = document.querySelector('.articles-grid');
        if (articlesGrid && visibleCount > 0) {
            articlesGrid.parentNode.insertBefore(resultsInfo, articlesGrid);
            
            // 清除过滤按钮
            const clearBtn = resultsInfo.querySelector('.clear-filter');
            clearBtn.addEventListener('click', function() {
                clearFilter();
            });
        }
        
        // 如果没有匹配的文章
        if (visibleCount === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: white; border-radius: var(--radius-lg);">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--light-gray); margin-bottom: 1rem;"></i>
                    <h3>没有找到 "${category}" 分类的文章</h3>
                    <p>请选择其他分类或查看所有文章</p>
                    <button class="btn btn-primary" style="margin-top: 1rem;">
                        查看所有文章
                    </button>
                </div>
            `;
            
            articlesGrid.parentNode.insertBefore(noResults, articlesGrid);
            articlesGrid.style.display = 'none';
            
            // 查看所有文章按钮
            const viewAllBtn = noResults.querySelector('.btn');
            viewAllBtn.addEventListener('click', clearFilter);
        }
    }
    
    function clearFilter() {
        // 显示所有文章
        const allArticles = document.querySelectorAll('.article-card');
        allArticles.forEach(article => {
            article.style.display = 'flex';
        });
        
        // 移除过滤信息
        const filterInfo = document.querySelector('.filter-results');
        const noResults = document.querySelector('.no-results');
        if (filterInfo) filterInfo.remove();
        if (noResults) noResults.remove();
        
        // 显示文章网格
        const articlesGrid = document.querySelector('.articles-grid');
        if (articlesGrid) articlesGrid.style.display = 'grid';
        
        // 移除分类活动状态
        categoryLinks.forEach(link => link.classList.remove('active'));
    }
    
    // 订阅表单
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                alert('请输入邮箱地址');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            // 模拟订阅成功
            const originalText = this.querySelector('.subscribe-btn').innerHTML;
            this.querySelector('.subscribe-btn').innerHTML = '<i class="fas fa-check"></i> 已订阅';
            this.querySelector('.subscribe-btn').style.background = 'var(--accent-green)';
            
            setTimeout(() => {
                this.querySelector('.subscribe-btn').innerHTML = originalText;
                this.querySelector('.subscribe-btn').style.background = '';
                emailInput.value = '';
                alert(`感谢订阅！\n我们已向 ${email} 发送确认邮件。`);
            }, 2000);
        });
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // 阅读进度指示器
    const createReadingProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    };
    
    createReadingProgress();
    
    // 添加淡入动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .article-card {
            animation: fadeIn 0.6s ease;
        }
        
        .featured-article {
            animation: fadeIn 0.8s ease;
        }
        
        .sidebar-widget {
            animation: fadeIn 0.7s ease;
        }
    `;
    document.head.appendChild(style);
    
    // 控制台信息
    console.log('%c📚 巴梦科技博客系统已加载', 'color: var(--accent-blue); font-size: 16px; font-weight: bold;');
    console.log('%c基于knowledge-2-web理念构建的内容管理系统', 'color: var(--gray-color); font-size: 14px;');
});