// 巴梦科技 - 网站交互脚本
// 2024 现代化交互设计

document.addEventListener('DOMContentLoaded', function() {
    // ========== 导航栏功能 ==========
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    
    // 移动端导航菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // 导航链接点击处理
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        const icon = navToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // 导航栏滚动效果
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 添加滚动时的背景效果
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(250, 251, 253, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'var(--glass-bg)';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
        
        // 滚动时隐藏/显示导航栏
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
        
        // 更新活动导航链接
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // ========== 滚动动画 ==========
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .feature, .stat-item, .contact-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // 初始化元素状态
    const initAnimations = function() {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .feature, .stat-item, .contact-item');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // 触发一次检查
        animateOnScroll();
    };
    
    // 监听滚动事件
    window.addEventListener('scroll', animateOnScroll);
    
    // ========== 统计数字动画 ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const targetText = statNumber.textContent;
                const targetNumber = parseInt(targetText);
                const suffix = targetText.replace(/[0-9]/g, '');
                
                let currentNumber = 0;
                const increment = targetNumber / 60;
                const duration = 1500;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // 使用缓动函数
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    currentNumber = Math.floor(targetNumber * easeOutQuart);
                    
                    statNumber.textContent = currentNumber + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                requestAnimationFrame(animate);
                statObserver.unobserve(statNumber);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => statObserver.observe(stat));
    
    // ========== 表单交互增强 ==========
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // 输入框焦点效果
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
        
        // 表单提交处理
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // 显示加载状态
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            submitBtn.disabled = true;
            
            // 模拟提交
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> 发送成功！';
                submitBtn.style.background = 'var(--gradient-accent)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
    
    // ========== 服务卡片交互 ==========
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // ========== 浮动元素交互 ==========
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 1.5}s`;
        
        el.addEventListener('click', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.3) rotate(360deg)';
            this.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                this.style.animationPlayState = 'running';
                this.style.transform = '';
                this.style.transition = '';
            }, 1000);
        });
        
        // 鼠标跟随效果
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 10;
            const y = (e.clientY - rect.top - rect.height / 2) / 10;
            
            this.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // ========== 视差滚动效果 ==========
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        const circuitBg = document.querySelector('.circuit-background');
        
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.03}px)`;
        }
        
        if (circuitBg) {
            circuitBg.style.backgroundPosition = `${scrolled * 0.02}px ${scrolled * 0.02}px`;
        }
    });
    
    // ========== 鼠标光效 ==========
    const createCursorGlow = () => {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
        
        // 在触摸设备上隐藏
        if ('ontouchstart' in window) {
            glow.style.display = 'none';
        }
    };
    
    // 只在桌面设备上启用光效
    if (window.innerWidth > 768) {
        createCursorGlow();
    }
    
    // ========== 粒子效果背景 ==========
    const createParticles = () => {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);
        
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
            
            particlesContainer.appendChild(particle);
        }
    };
    
    // 启用粒子效果
    createParticles();
    
    // ========== 页面加载动画 ==========
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        // 初始化动画
        initAnimations();
    });
    
    // ========== 滚动进度指示器 ==========
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
            z-index: 10001;
            transition: width 0.1s;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    };
    
    createScrollProgress();
    
    // ========== 平滑回到顶部 ==========
    const createBackToTop = () => {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--gradient-primary);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        document.body.appendChild(backToTop);
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = '';
        });
    };
    
    createBackToTop();
    
    // ========== 控制台欢迎信息 ==========
    console.log('%c🤖 欢迎来到巴梦科技！', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c创造智能未来，从玩具到企业级AI', 'color: #8b8fa3; font-size: 14px;');
    console.log('%c✨ 网站已加载完成！', 'color: #00f2fe; font-size: 12px;');
});