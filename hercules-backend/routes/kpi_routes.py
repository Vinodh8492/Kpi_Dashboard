from flask import Blueprint, request, jsonify
from extensions import db
from models.kpi import KPI
from models.kpi_material import KPIMaterial
from datetime import datetime
from pathlib import Path
import pandas as pd
import os

kpi_bp = Blueprint("kpi", __name__)

# 🟢 **Route to Insert KPI Data**
@kpi_bp.route("/kpi", methods=["POST"])
def add_kpi():
    try:
        data = request.get_json()
        new_kpi = KPI(
            batch_guid=data.get("batch_guid"),
            batch_name=data.get("batch_name"),
            product_name=data.get("product_name"),
            batch_act_start=datetime.strptime(data.get("batch_act_start"), "%Y-%m-%d %H:%M:%S"),
        )
        db.session.add(new_kpi)
        db.session.commit()
        return jsonify({"message": "KPI added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 🟢 **Route to Get All KPI Data**
CSV_FILE_PATH = "/Users/vinodhkumar/Downloads/100_Kpis_BatchMaterials.csv"  # Change this to the actual path

# 🟢 **Route to Get All KPI Data**
@kpi_bp.route("/kpi", methods=["GET"])
def get_kpis():
    try:
        materials = KPIMaterial.query.all()

        kpi_list = []
        for mat in materials:
            kpi_list.append({
                "Batch GUID": mat.batch_guid,
                "Batch Name": mat.batch_name,
                "Product Name": mat.product_name,
                "Batch Act Start": mat.batch_act_start.strftime("%Y-%m-%d %H:%M:%S") if mat.batch_act_start else None,
                "Batch Act End": mat.batch_act_end.strftime("%Y-%m-%d %H:%M:%S") if mat.batch_act_end else None,
                "Quantity": mat.quantity,
                "Material Name": mat.material_name,
                "Material Code": mat.material_code,
                "SetPoint Float": mat.setpoint_float,
                "Actual Value Float": mat.actual_value_float,
                "Source Server": mat.source_server,
                "ROOTGUID": mat.rootguid,
                "OrderId": mat.order_id,
                "EventID": mat.event_id,
                "Batch Transfer Time": mat.batch_transfer_time.strftime("%Y-%m-%d %H:%M:%S") if mat.batch_transfer_time else None,
                "FormulaCategoryName": mat.formula_category_name
            })

        return jsonify(kpi_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
