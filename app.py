# app.py

# Import Flask tools we need
from flask import Flask, render_template, request, jsonify

# Import random to pick random characters and shuffle
import random

# Import string to get ready-made letter/number/symbol lists
import string

# Create the Flask application object
app = Flask(__name__)


# GET route: show the main page
@app.route("/")
def index():
    # Render the HTML template from the templates folder
    return render_template("index.html")


# POST route: generate the password and return it as JSON
@app.route("/generate", methods=["POST"])
def generate():
    # Get the JSON data the frontend sent
    data = request.get_json()

    # Read the three values sent by the frontend
    nr_letters = data.get("letters")
    nr_numbers = data.get("numbers")
    nr_symbols = data.get("symbols")

    # Validate: each value must be a non-negative whole number
    for value in (nr_letters, nr_numbers, nr_symbols):
        # Reject if it's not an integer (True/False are ints in Python, so check bool)
        if not isinstance(value, int) or isinstance(value, bool) or value < 0:
            # Send back an error message with status 400 (bad request)
            return jsonify({"error": "Please enter valid non-negative numbers."}), 400

    # Build the password character by character
    password_chars = []

    # Pick the requested number of random letters
    for _ in range(nr_letters):
        password_chars.append(random.choice(string.ascii_letters))

    # Pick the requested number of random digits
    for _ in range(nr_numbers):
        password_chars.append(random.choice(string.digits))

    # Pick the requested number of random symbols
    for _ in range(nr_symbols):
        password_chars.append(random.choice(string.punctuation))

    # Shuffle so the order isn't letters-then-numbers-then-symbols
    random.shuffle(password_chars)

    # Join the list into a single string
    password = "".join(password_chars)

    # Return the password as JSON
    return jsonify({"password": password})


# Run the app only when this file is executed directly
if __name__ == "__main__":
    app.run(debug=True)