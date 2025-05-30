from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)

# Ensure database folder exists
if not os.path.exists("db"):
    os.makedirs("db")

DATABASE = "db/amity_store.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_phone TEXT NOT NULL,
            product_name TEXT NOT NULL,
            price INTEGER NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def homepage():
    return render_template('homepage.html')

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        phone = request.form['phone']
        password = request.form['password']
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE phone = ?", (phone,))
        user = cur.fetchone()
        if user:
            if user['password'] == password:
                conn.close()
                return redirect(url_for('homepage'))
            else:
                conn.close()
                return "Incorrect password", 401
        else:
            cur.execute("INSERT INTO users (phone, password) VALUES (?, ?)", (phone, password))
            conn.commit()
            conn.close()
            return redirect(url_for('homepage'))
    return render_template('signin.html')

@app.route('/products')
def products():
    return render_template('Products.html')

@app.route('/student_toolkit')
def student_toolkit():
    return render_template('sc_html.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/orders')
def orders():
    return render_template('you.html')

@app.route('/buy', methods=['POST'])
def buy():
    data = request.get_json()
    phone = data.get('phone')
    product = data.get('product')
    price = data.get('price')
    if not phone or not product or not price:
        return jsonify({'message': 'Missing data'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO orders (user_phone, product_name, price, timestamp) VALUES (?, ?, ?, ?)",
                (phone, product, price, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Order placed successfully'}), 200

@app.route('/get_orders/<phone>', methods=['GET'])
def get_orders(phone):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT product_name, price, timestamp FROM orders WHERE user_phone = ?", (phone,))
    rows = cur.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/delete_orders/<phone>', methods=['DELETE'])
def delete_orders(phone):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM orders WHERE user_phone = ?", (phone,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Orders deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)

