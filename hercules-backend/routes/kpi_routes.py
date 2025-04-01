from flask import Blueprint, request, jsonify
from app import db
from models.kpi import KPI
from datetime import datetime
import pandas as pd
import os

kpi_bp = Blueprint("kpi", __name__)

# 🟢 **Route to Insert KPI Data**
@kpi_bp.route("/kpi", methods=["POST"])
def add_kpi():
    try:
        data = request.get_json()
        new_kpi = KPI(
            batch_guid=data.get("Batch GUID"),
            batch_name=data.get("Batch Name"),
            product_name=data.get("Product Name"),
            batch_act_start=datetime.strptime(data.get("Batch Act Start"), "%Y-%m-%d %H:%M:%S"),
        )
        db.session.add(new_kpi)
        db.session.commit()
        return jsonify({"message": "KPI added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 🟢 **Route to Get All KPI Data**
CSV_FILE_PATH = "/Users/vinodhkumar/Downloads/100_Kpis_BatchMaterials.csv"  # Change this to the actual path

# 🟢 **Route to Get All KPI Data**
@kpi_bp.route("/api/kpi", methods=["GET"])
def get_kpis():
    try:
        if not os.path.exists(CSV_FILE_PATH):
            return jsonify({"error": "CSV file not found"}), 404

        df = pd.read_csv(CSV_FILE_PATH)

        required_columns = {"Batch GUID", "Batch Name", "Product Name", "Batch Act Start"}
        if not required_columns.issubset(set(df.columns)):
            return jsonify({"error": "CSV file does not contain required columns"}), 400

        kpi_list = df.to_dict(orient="records")
        return jsonify(kpi_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
