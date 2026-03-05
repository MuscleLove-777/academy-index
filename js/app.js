/**
 * app.js - アカデミーインデックス アプリケーションロジック
 *
 * academies.js で定義されたグローバル変数 ACADEMIES, CATEGORIES を使用し、
 * カテゴリフィルタ・検索・ダークモード切替などのUI機能を提供する。
 */

const App = {
    currentCategory: "すべて",
    searchQuery: "",

    /**
     * アプリケーション初期化
     */
    init() {
        this.renderStats();
        this.renderFilters();
        this.renderAcademies();
        this.setupEventListeners();
        this.loadDarkMode();
    },

    /**
     * ヒーローセクションの統計情報を表示
     */
    renderStats() {
        const totalAcademies = ACADEMIES.length;
        const totalLevels = ACADEMIES.reduce((sum, a) => sum + a.levels, 0);
        const totalModules = ACADEMIES.reduce((sum, a) => sum + a.modules, 0);

        document.getElementById('stats').innerHTML = `
            <div class="stat-card"><div class="stat-num">${totalAcademies}</div><div class="stat-label">アカデミー</div></div>
            <div class="stat-card"><div class="stat-num">${totalLevels}</div><div class="stat-label">レベル</div></div>
            <div class="stat-card"><div class="stat-num">${totalModules}</div><div class="stat-label">モジュール</div></div>
        `;
    },

    /**
     * カテゴリフィルタボタンをレンダリング
     */
    renderFilters() {
        const container = document.getElementById('filterTags');
        container.innerHTML = CATEGORIES.map(cat =>
            `<button class="filter-tag ${cat === this.currentCategory ? 'active' : ''}"
                     onclick="App.filterByCategory('${cat}')">${cat}</button>`
        ).join('');
    },

    /**
     * アカデミーカード一覧をレンダリング
     * currentCategory と searchQuery に基づいてフィルタリングする
     */
    renderAcademies() {
        const filtered = ACADEMIES.filter(a => {
            const matchCategory = this.currentCategory === "すべて" || a.category === this.currentCategory;
            const matchSearch = this.searchQuery === "" ||
                a.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                a.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                a.category.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchCategory && matchSearch;
        });

        const grid = document.getElementById('academyGrid');
        const noResults = document.getElementById('noResults');

        // 結果が0件の場合
        if (filtered.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        // カードを生成
        grid.innerHTML = filtered.map((academy, index) => `
            <a href="${academy.path}" class="academy-card fade-in" style="border-left-color: ${academy.color}; animation-delay: ${index * 0.08}s;">
                <div class="card-header">
                    <span class="card-icon">${academy.icon}</span>
                    <div>
                        <h3 class="card-title">${academy.title}</h3>
                        <span class="card-badge" style="background: ${academy.color}20; color: ${academy.color}">${academy.category}</span>
                    </div>
                </div>
                <div class="card-body">
                    <p>${academy.description}</p>
                </div>
                <div class="card-footer">
                    <div class="card-meta">
                        <span>📚 ${academy.levels} レベル</span>
                        <span>📝 ${academy.modules} モジュール</span>
                    </div>
                    <span class="card-link" style="color: ${academy.color}">学習を始める →</span>
                </div>
            </a>
        `).join('');
    },

    /**
     * カテゴリでフィルタリング
     * @param {string} category - 選択されたカテゴリ名
     */
    filterByCategory(category) {
        this.currentCategory = category;
        this.renderFilters();
        this.renderAcademies();
    },

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // 検索入力
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderAcademies();
        });

        // ダークモード切替ボタン
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('academy-index-dark', isDark);
            document.getElementById('darkModeToggle').textContent = isDark ? '☀️' : '🌙';
        });
    },

    /**
     * ダークモード設定を localStorage から復元
     */
    loadDarkMode() {
        if (localStorage.getItem('academy-index-dark') === 'true') {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').textContent = '☀️';
        }
    }
};

// DOM読み込み完了後にアプリを初期化
document.addEventListener('DOMContentLoaded', () => App.init());
