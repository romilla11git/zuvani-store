// SIMPLE THEME SYSTEM - GUARANTEED WORKING
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('zuvani_theme') || 'dark';
        this.applyTheme(this.currentTheme);
    }

    changeTheme(themeName) {
        this.currentTheme = themeName;
        localStorage.setItem('zuvani_theme', themeName);
        this.applyTheme(themeName);
        alert(`Theme changed to ${themeName}`);
    }

    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
    }
}

const themeManager = new ThemeManager();

function changeTheme(themeName) {
    themeManager.changeTheme(themeName);
}

function toggleThemeMenu() {
    const menu = document.getElementById('themeMenu');
    menu.classList.toggle('active');
}
