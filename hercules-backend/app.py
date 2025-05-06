from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate  # ✅ import from extensions
import pymysql
import os

# ------------------------------------------------------
# 🔧 Initialize Flask App and Configuration
# ------------------------------------------------------
app = Flask(__name__)
app.config.from_object(Config)

# ------------------------------------------------------
# 🔓 Enable CORS (Allow frontend dev at localhost:5173)
# ------------------------------------------------------
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# ------------------------------------------------------
# 🗃️ Database Setup
# ------------------------------------------------------
db.init_app(app)
migrate.init_app(app, db)


# ------------------------------------------------------
# 🔌 Register Blueprints
# ------------------------------------------------------
from routes.kpi_routes import kpi_bp
from routes.logo_routes import logo_bp
from routes.settings import settings_bp
from routes.report_scheduler import report_bp

app.register_blueprint(kpi_bp, url_prefix="/api")
app.register_blueprint(logo_bp, url_prefix="/api")
app.register_blueprint(settings_bp, url_prefix="/api")
app.register_blueprint(report_bp, url_prefix="/api")

# ------------------------------------------------------
# 📦 Load Models (Optional: only if needed elsewhere)
# ------------------------------------------------------
from models import kpi

# ------------------------------------------------------
# 🚀 Run the Flask App
# ------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
