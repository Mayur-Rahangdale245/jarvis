from flask import Flask, render_template, request, jsonify
import wikipedia
import random

app = Flask(__name__)

def process_command(cmd):
    cmd = cmd.lower()
    if "joke" in cmd:
        return random.choice([
            "Why did the computer show up late? It had a hard drive!",
            "Why do programmers prefer dark mode? Because light attracts bugs!"
        ])
    elif "who is" in cmd or "what is" in cmd:
        try:
            return wikipedia.summary(cmd, sentences=2)
        except:
            return "Couldn't find anything on Wikipedia."
    else:
        return "Sorry, I didn't understand that."

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/command", methods=["POST"])
def command():
    data = request.json
    cmd = data.get("command", "")
    response = process_command(cmd)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)