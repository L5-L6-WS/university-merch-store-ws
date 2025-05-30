from flask import Flask, render_template, request, redirect, jsonify
import sqlite3
import os

app = Flask(__name__)

# -------------------- DATABASE SETUP --------------------
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    # Create users table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phone TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )''')
    # Create orders table
    c.execute('''CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_phone TEXT NOT NULL,
                    product TEXT NOT NULL,
                    size TEXT,
                    quantity INTEGER,
                    status TEXT DEFAULT 'Placed'
                )''')
    conn.commit()
    conn.close()

init_db()

# -------------------- ROUTES --------------------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signin')
def signin():
    return render_template('signin.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/orders')
def orders():
    return render_template('orders.html')

@app.route('/studenttoolkit')
def student_toolkit():
    return render_template('student_toolkit.html')

# -------------------- AUTH --------------------
@app.route('/login', methods=['POST'])
def login():
    phone = request.form['phone']
    password = request.form['password']

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE phone=? AND password=?", (phone, password))
    user = c.fetchone()
    conn.close()

    if user:
        return redirect('/products')
    else:
        return "Invalid credentials", 401

@app.route('/signup', methods=['POST'])
def signup():
    phone = request.form['phone']
    password = request.form['password']

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (phone, password) VALUES (?, ?)", (phone, password))
        conn.commit()
    except sqlite3.IntegrityError:
        return "User already exists", 400
    conn.close()

    return redirect('/signin')

# -------------------- ORDER API --------------------
@app.route('/place_order', methods=['POST'])
def place_order():
    data = request.get_json()
    phone = data['phone']
    product = data['product']
    size = data.get('size')
    quantity = data.get('quantity', 1)

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO orders (user_phone, product, size, quantity) VALUES (?, ?, ?, ?)",
              (phone, product, size, quantity))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Order placed successfully'}), 200

@app.route('/get_orders', methods=['GET'])
def get_orders():
    phone = request.args.get('phone')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT product, size, quantity, status FROM orders WHERE user_phone=?", (phone,))
    orders = c.fetchall()
    conn.close()

    order_list = [{'product': o[0], 'size': o[1], 'quantity': o[2], 'status': o[3]} for o in orders]
    return jsonify(order_list)

# -------------------- MAIN --------------------
if __name__ == '__main__':
    app.run(debug=True)
