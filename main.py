from flask import Flask, jsonify, request
from flask_cors import CORS
from player import get_random_starter_and_season, get_shot_chart

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/player', methods=['GET'])
def get_player():
    player_id, season, player_name = get_random_starter_and_season()
    try:
        shot_data, player_stats = get_shot_chart(player_id, season)
        return jsonify({
            "player_id": player_id,
            "season": season,
            "player_name": player_name,
            "shot_data": shot_data.to_dict(orient="records"),
            "player_stats": player_stats.to_dict(orient="records")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)