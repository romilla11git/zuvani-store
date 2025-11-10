// SIMPLE THEME TOGGLE
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('zuvani_theme') || 'dark';
        this.applyTheme(this.currentTheme);
        this.updateToggleButton();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('zuvani_theme', this.currentTheme);
        this.applyTheme(this.currentTheme);
        this.updateToggleButton();
    }

    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Update all theme-dependent elements
        document.querySelectorAll('body, .navbar, .glass-card').forEach(el => {
            el.style.transition = 'all 0.3s ease';
        });
    }

    updateToggleButton() {
        const button = document.getElementById('themeToggle');
        if (button) {
            const icon = this.currentTheme === 'dark' ? '🌙' : '☀️';
            const text = this.currentTheme === 'dark' ? 'Dark' : 'Light';
            button.innerHTML = `${icon} ${text}`;
        }
    }
}

const themeManager = new ThemeManager();

function toggleTheme() {
    themeManager.toggleTheme();
}
