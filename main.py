import numpy as np
from flask import Flask, render_template, redirect, url_for, request, jsonify
import database
import random
import json

app = Flask(__name__)


def custom_to_json(obj):
    # Serialize Python object to JSON with single quotes
    return json.dumps(obj, ensure_ascii=False).replace('"', '&quot;')


app.jinja_env.filters['custom_to_json'] = custom_to_json


# Home page route with form
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        user_id = request.form['user_id']
        print(user_id)
        # Redirect to the page that displays the user ID
        return redirect(url_for('user_page', user_id=user_id))
    return render_template('home.html')


# User page route
@app.route('/user/<user_id>')
def user_page(user_id):
    conn = database.PostgresServer()
    conn.connect()
    models = conn.get_all_models(user_id)
    return render_template('user_page.html', user_id=user_id, models=models)


initial_data = {
    'labels': ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    'values': [65, 59, 80, 81, 56, 55, 40]
}


def generate_random_data():
    new_values = [random.randint(0, 100) for _ in range(len(initial_data['labels']))]
    return {'labels': initial_data['labels'], 'values': new_values}


@app.route('/update_chart_data')
def update_chart_data():
    # Get updated data (replace this with your actual data retrieval logic)
    updated_data = generate_random_data()
    return jsonify(updated_data)


@app.route('/process_model', methods=['POST'])
def process_model():
    conn = database.PostgresServer()
    conn.connect()
    selected_model = request.json['model']
    model_id = selected_model[0]
    user_id = selected_model[1]
    max_size = selected_model[4]
    params_only_data = []
    data = conn.get_data(user_id, model_id, max_size)
    data = np.asarray(data)[:, 3:6]
    data = data.T.tolist()


    labels = ["RPM", "Speed", "Temperature", "Manifold pressure"]


    print(len(data))
    print('Selected model:', selected_model)
    # Return a response if needed
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
