# 📈 VirtualStock - Paper Trading Platform

A modern virtual paper trading web application with zero financial risk, live simulated market fluctuations, interactive portfolio & P&L tracking, and an AI market analyst copilot.

---

## ✨ Features

- **Virtual Trading Engine**: Practice trading with ₹1,00,000 in simulated funds. Real-time balance updates, buy/sell orders, and stop-loss support.
- **Dynamic Watchlist**: Real-time ticker and market cards for top stocks (e.g., RELIANCE, TCS, HDFCBANK, INFY, AAPL, NVDA, TSLA).
- **Portfolio & P&L Dashboard**: Interactive Chart.js performance curve, live holdings breakdown, and transaction history.
- **AI Market Analyst**: Built-in chat assistant offering insights on technical indicators, chart patterns, risk management, and market concepts.
- **Modern Glassmorphic UI**: Custom CSS with responsive layouts, glowing accents, hero carousel, and dark theme.

---

## 📁 Project Structure

```
├── app.py              # Flask backend server & REST API endpoints
├── models.py           # SQLAlchemy models for Users, Stocks, and Trades
├── style.css           # Modern custom CSS design system
├── app.js              # Frontend interactive trading & watchlist engine
├── index.html          # Main landing page & live market watchlist
├── profit_loss.html    # Portfolio performance & P&L tracker
├── chat.html           # AI Trading Assistant chat interface
├── login.html          # Authentication & demo account registration
└── images/             # Visual assets and illustrations
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.8+

### 2. Setup Virtual Environment & Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install flask flask-sqlalchemy flask-login requests
```

### 3. Run the Application
```bash
python app.py
```

Open your browser and navigate to:
```
http://localhost:8000
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+), Chart.js, FontAwesome
- **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-Login, SQLite

---

## 📜 License

This project is licensed under the MIT License.
