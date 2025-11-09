// ===== ZUVANI TEES - THEME SYSTEM =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('zuvani_theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Theme selector toggle
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-selector')) {
                this.closeThemeMenu();
            }
        });
    }

    changeTheme(themeName) {
        this.currentTheme = themeName;
        localStorage.setItem('zuvani_theme', themeName);
        this.applyTheme(themeName);
        this.closeThemeMenu();
        this.showThemeNotification(themeName);
    }

    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Update active theme in menu
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeOption = document.querySelector(`[onclick="changeTheme('${themeName}')"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    toggleThemeMenu() {
        const menu = document.getElementById('themeMenu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }

    closeThemeMenu() {
        const menu = document.getElementById('themeMenu');
        if (menu) {
            menu.classList.remove('active');
        }
    }

    showThemeNotification(themeName) {
        const themeNames = {
            'dark': '🖤 Street Dark',
            'light': '💙 Fresh Light', 
            'vibrant': '💜 Urban Vibrant',
            'nature': '💚 Earthy Natural',
            'luxury': '⭐ Luxury Gold',
            'minimal': '⚪ Modern Minimal'
        };

        const message = `Theme changed to ${themeNames[themeName]}`;
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-palette"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 1rem 1.5rem;
            border-radius: 25px;
            box-shadow: 0 4px 12px var(--shadow-color);
            z-index: 10000;
            animation: slideInUp 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            backdrop-filter: var(--glass-blur);
        `;

        document.body.appendChild(notification);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Theme preview function
    previewTheme(themeName) {
        const originalTheme = this.currentTheme;
        this.applyTheme(themeName);
        
        // Revert after 2 seconds if not confirmed
        setTimeout(() => {
            if (this.currentTheme === originalTheme) {
                this.applyTheme(originalTheme);
            }
        }, 2000);
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Global functions for HTML onclick
function changeTheme(themeName) {
    themeManager.changeTheme(themeName);
}

function toggleThemeMenu() {
    themeManager.toggleThemeMenu();
}

function previewTheme(themeName) {
    themeManager.previewTheme(themeName);
}

// Add theme notification styles
const themeStyles = `
    @keyframes slideInUp {
        from { transform: translateX(-50%) translateY(100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideOutDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100%); opacity: 0; }
    }
    
    .theme-option.active {
        background: color-mix(in srgb, var(--accent-color) 20%, transparent);
        border: 1px solid var(--accent-color);
    }
    
    .theme-notification {
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    }
`;

const style = document.createElement('style');
style.textContent = themeStyles;
document.head.appendChild(style);