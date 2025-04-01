from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS  # Import CORS
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend communication
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Initialize database and migrations
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models
from models import kpi  

# Import and register blueprints
from routes.kpi_routes import kpi_bp  # Import KPI API routes
app.register_blueprint(kpi_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
