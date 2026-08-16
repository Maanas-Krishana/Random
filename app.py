import os
from flask import Flask, send_from_directory, jsonify, request, render_template_string
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Stock, Trade

app = Flask(__name__, static_folder='.', static_url_path='')

# Configuration
app.config['SECRET_KEY'] = 'virtual_stock_secret_key_2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trading.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB & Login Manager
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login_page'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Initialize Database with default data
with app.app_context():
    db.create_all()
    if Stock.query.count() == 0:
        sample_stocks = [
            Stock(symbol='RELIANCE', name='Reliance Industries Ltd.', price=2980.50, change=2.10, high=3010.00, low=2940.00, volume='4.2M'),
            Stock(symbol='TCS', name='Tata Consultancy Services', price=4250.40, change=-0.45, high=4290.00, low=4210.00, volume='1.8M'),
            Stock(symbol='HDFCBANK', name='HDFC Bank Limited', price=1640.80, change=0.65, high=1655.00, low=1630.00, volume='6.1M'),
            Stock(symbol='INFY', name='Infosys Limited', price=1890.20, change=1.45, high=1910.00, low=1875.00, volume='3.5M'),
            Stock(symbol='AAPL', name='Apple Inc.', price=224.50, change=1.80, high=226.00, low=221.00, volume='18.9M'),
            Stock(symbol='NVDA', name='NVIDIA Corporation', price=128.20, change=3.40, high=130.50, low=124.00, volume='45.2M'),
            Stock(symbol='TSLA', name='Tesla Inc.', price=214.10, change=-1.15, high=219.00, low=212.00, volume='22.4M')
        ]
        db.session.bulk_save_objects(sample_stocks)
        db.session.commit()

# --- Page Routes ---
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/index.html')
def index_page():
    return send_from_directory('.', 'index.html')

@app.route('/profit_loss.html')
def profit_loss_page():
    return send_from_directory('.', 'profit_loss.html')

@app.route('/chat.html')
def chat_page():
    return send_from_directory('.', 'chat.html')

@app.route('/login.html')
def login_page():
    return send_from_directory('.', 'login.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# --- API Endpoints ---
@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    stocks = Stock.query.all()
    return jsonify([{
        'symbol': s.symbol,
        'name': s.name,
        'price': s.price,
        'change': s.change,
        'high': s.high,
        'low': s.low,
        'volume': s.volume
    } for s in stocks])

@app.route('/api/chat', methods=['POST'])
def api_chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    return jsonify({
        'response': f"StockBot: Analyzed your query regarding '{message}'. Technical indicators signal solid volume with healthy consolidation."
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"🚀 Virtual Stock Platform running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
