// Virtual Stock Platform JavaScript

// Initial State and Storage
let state = {
    balance: parseFloat(localStorage.getItem('vs_balance')) || 100000.00,
    trades: JSON.parse(localStorage.getItem('vs_trades')) || [],
    portfolio: JSON.parse(localStorage.getItem('vs_portfolio')) || {},
    currentTradeStock: null
};

// Stock Catalog
const STOCKS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2980.50, change: 2.10, high: 3010.00, low: 2940.00, volume: '4.2M' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4250.40, change: -0.45, high: 4290.00, low: 4210.00, volume: '1.8M' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: 1640.80, change: 0.65, high: 1655.00, low: 1630.00, volume: '6.1M' },
    { symbol: 'INFY', name: 'Infosys Limited', price: 1890.20, change: 1.45, high: 1910.00, low: 1875.00, volume: '3.5M' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1195.60, change: 0.85, high: 1205.00, low: 1180.00, volume: '5.4M' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 224.50, change: 1.80, high: 226.00, low: 221.00, volume: '18.9M', isUSD: true },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 128.20, change: 3.40, high: 130.50, low: 124.00, volume: '45.2M', isUSD: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 214.10, change: -1.15, high: 219.00, low: 212.00, volume: '22.4M', isUSD: true }
];

// Carousel Navigation
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel .item');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');

function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (nextButton && prevButton) {
    nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
    prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
    // Auto-advance every 7 seconds
    setInterval(() => showSlide(currentSlide + 1), 7000);
}

// Format Currency
function formatCurrency(val, isUSD = false) {
    if (isUSD) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Update Balance UI
function updateBalanceDisplay() {
    const el = document.getElementById('userBalanceDisplay');
    if (el) {
        el.textContent = formatCurrency(state.balance);
    }
}

// Render Stocks Grid
function renderStocks(filterQuery = '') {
    const container = document.getElementById('stocksContainer');
    if (!container) return;

    const filtered = STOCKS.filter(s => 
        s.symbol.toLowerCase().includes(filterQuery.toLowerCase()) || 
        s.name.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">No matching stocks found for "${filterQuery}"</div>`;
        return;
    }

    container.innerHTML = filtered.map(stock => {
        const isPositive = stock.change >= 0;
        return `
            <div class="stock-card">
                <div class="stock-top">
                    <div class="stock-info">
                        <h3>${stock.symbol}</h3>
                        <p>${stock.name}</p>
                    </div>
                    <div class="stock-price-box">
                        <div class="stock-price">${formatCurrency(stock.price, stock.isUSD)}</div>
                        <span class="ticker-change ${isPositive ? 'up' : 'down'}">
                            <i class="fa-solid fa-arrow-trend-${isPositive ? 'up' : 'down'}"></i>
                            ${isPositive ? '+' : ''}${stock.change.toFixed(2)}%
                        </span>
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); padding:0.5rem 0; border-top:1px solid var(--border-glass); border-bottom:1px solid var(--border-glass);">
                    <span>24h High: ${formatCurrency(stock.high, stock.isUSD)}</span>
                    <span>24h Low: ${formatCurrency(stock.low, stock.isUSD)}</span>
                    <span>Vol: ${stock.volume}</span>
                </div>

                <div class="stock-card-actions">
                    <button class="btn-buy" onclick="openTradeModal('${stock.symbol}', ${stock.price}, ${stock.isUSD || false})">
                        <i class="fa-solid fa-cart-shopping"></i> Buy
                    </button>
                    <button class="btn-sell" onclick="openTradeModal('${stock.symbol}', ${stock.price}, ${stock.isUSD || false})">
                        <i class="fa-solid fa-arrow-trend-down"></i> Sell
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Search Filter
const searchInput = document.getElementById('searchBar');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderStocks(e.target.value.trim());
    });
}

// Trade Modal Functions
function openTradeModal(symbol, price, isUSD = false) {
    const stock = STOCKS.find(s => s.symbol === symbol) || { symbol, price, isUSD };
    state.currentTradeStock = stock;

    document.getElementById('modalStockTitle').textContent = `Trade ${stock.symbol}`;
    document.getElementById('modalStockPrice').textContent = formatCurrency(stock.price, stock.isUSD);
    document.getElementById('modalAvailableBalance').textContent = formatCurrency(state.balance);
    
    updateOrderTotal();

    const modal = document.getElementById('tradeModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeTradeModal() {
    const modal = document.getElementById('tradeModal');
    if (modal) {
        modal.classList.remove('active');
    }
    state.currentTradeStock = null;
}

function updateOrderTotal() {
    if (!state.currentTradeStock) return;
    const qty = parseInt(document.getElementById('tradeQuantity').value) || 0;
    const total = qty * state.currentTradeStock.price;
    document.getElementById('modalOrderTotal').textContent = formatCurrency(total, state.currentTradeStock.isUSD);
}

// Trade Execution
function executeTrade(type) {
    const stock = state.currentTradeStock;
    if (!stock) return;

    const qty = parseInt(document.getElementById('tradeQuantity').value);
    const stopLoss = parseFloat(document.getElementById('tradeStopLoss').value) || null;

    if (!qty || qty <= 0) {
        showToast('Please enter a valid quantity of shares.', 'error');
        return;
    }

    const totalCost = qty * stock.price;

    if (type === 'BUY') {
        if (state.balance < totalCost) {
            showToast('Insufficient virtual funds for this purchase!', 'error');
            return;
        }
        state.balance -= totalCost;

        // Update portfolio
        if (!state.portfolio[stock.symbol]) {
            state.portfolio[stock.symbol] = { quantity: 0, avgPrice: 0, isUSD: stock.isUSD };
        }
        const currentHolding = state.portfolio[stock.symbol];
        const newTotalShares = currentHolding.quantity + qty;
        currentHolding.avgPrice = ((currentHolding.quantity * currentHolding.avgPrice) + totalCost) / newTotalShares;
        currentHolding.quantity = newTotalShares;
    } else if (type === 'SELL') {
        const currentHolding = state.portfolio[stock.symbol];
        if (!currentHolding || currentHolding.quantity < qty) {
            showToast(`You do not own enough shares of ${stock.symbol} to sell!`, 'error');
            return;
        }
        state.balance += totalCost;
        currentHolding.quantity -= qty;
        if (currentHolding.quantity === 0) {
            delete state.portfolio[stock.symbol];
        }
    }

    // Record trade
    const tradeRecord = {
        id: 'TRD-' + Date.now(),
        symbol: stock.symbol,
        type: type,
        quantity: qty,
        price: stock.price,
        total: totalCost,
        stopLoss: stopLoss,
        timestamp: new Date().toISOString()
    };
    state.trades.unshift(tradeRecord);

    // Save to LocalStorage
    localStorage.setItem('vs_balance', state.balance.toString());
    localStorage.setItem('vs_portfolio', JSON.stringify(state.portfolio));
    localStorage.setItem('vs_trades', JSON.stringify(state.trades));

    updateBalanceDisplay();
    closeTradeModal();
    showToast(`Successfully executed ${type} order for ${qty} shares of ${stock.symbol}!`, 'success');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'circle-check' : (type === 'error' ? 'circle-exclamation' : 'circle-info');
    toast.innerHTML = `
        <i class="fa-solid fa-${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Random Price Fluctuation Simulation for Real-Time feel
setInterval(() => {
    STOCKS.forEach(stock => {
        const changePercent = (Math.random() - 0.48) * 0.4;
        stock.price = Math.max(1, stock.price * (1 + changePercent / 100));
        stock.change += changePercent;
    });
    if (!document.getElementById('searchBar')?.value) {
        renderStocks();
    }
}, 4500);

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceDisplay();
    renderStocks();
});