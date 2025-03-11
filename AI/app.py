import requests
from flask import Flask, request, jsonify
import os
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/generate-recommendation', methods=['POST'])
def generate_recommendation():
    try:
        # Get firebase_uid from the request
        data = request.json
        firebase_uid = data.get('firebase_uid')

        if not firebase_uid:
            return jsonify({"error": "firebase_uid is required"}), 400

        # Determine the absolute path of the current directory
        current_directory = os.path.dirname(os.path.abspath(__file__))

        # Define paths
        python_path = os.path.join(current_directory, ".venv2", "Scripts", "python.exe")
        recommendation_script_path = os.path.join(current_directory, "recommendation.py")

        # Check if files exist
        if not os.path.exists(python_path):
            logger.error(f"Python executable not found: {python_path}")
            return jsonify({"error": f"Python executable not found: {python_path}"}), 500
        if not os.path.exists(recommendation_script_path):
            logger.error(f"Recommendation script not found: {recommendation_script_path}")
            return jsonify({"error": f"Recommendation script not found: {recommendation_script_path}"}), 500

        # Define the API URL
        api_url = 'http://localhost:3000/api/RecommandationEntrainement/'

        # Make the POST request to the external API
        response = requests.post(api_url, json={'firebase_uid': firebase_uid})

        if response.status_code == 201:
            logger.info("Recommendation generated successfully")
            return jsonify({"message": "Recommendation generated successfully", "output": response.json()}), 200
        else:
            logger.error(f"Error calling the API: {response.text}")
            return jsonify({"error": "Error calling the API", "details": response.text}), 500

    except Exception as e:
        logger.error(f"Error generating recommendation: {str(e)}")
        return jsonify({"error": f"Internal error: {str(e)}"}), 500

# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)