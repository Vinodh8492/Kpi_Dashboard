from flask import Blueprint, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename

logo_bp = Blueprint("logo", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@logo_bp.route("/logo", methods=["GET", "POST"])
def handle_logo():
    if request.method == "POST":
        if "logo" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["logo"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            ext = file.filename.rsplit(".", 1)[1].lower()
            filename = f"logo.{ext}"  # Always overwrite with same filename
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            return jsonify({"logoUrl": f"/api/uploads/{filename}"}), 200
        else:
            return jsonify({"error": "Invalid file type"}), 400

    # GET: Return latest uploaded logo (assuming standard name)
    for ext in ALLOWED_EXTENSIONS:
        path = os.path.join(UPLOAD_FOLDER, f"logo.{ext}")
        if os.path.exists(path):
            return jsonify({"logoUrl": f"/api/uploads/logo.{ext}"})
    return jsonify({"logoUrl": ""})

@logo_bp.route("/uploads/<filename>")
def serve_logo(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)




# from flask import Blueprint, request, jsonify, send_from_directory
# import os
# from werkzeug.utils import secure_filename
# from PIL import Image
# import io

# logo_bp = Blueprint("logo", __name__)

# UPLOAD_FOLDER = "uploads"
# ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

# # Ensure the upload folder exists
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# def allowed_file(filename):
#     return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# @logo_bp.route("/logo", methods=["POST", "GET"])
# def handle_logo():
#     if request.method == "POST":
#         if "logo" not in request.files:
#             return jsonify({"error": "No file part"}), 400

#         file = request.files["logo"]
#         if file.filename == "":
#             return jsonify({"error": "No selected file"}), 400

#         if file and allowed_file(file.filename):
#             # Convert and save as 'logo.png' always
#             try:
#                 img = Image.open(file.stream).convert("RGBA")
#                 filepath = os.path.join(UPLOAD_FOLDER, "logo.png")
#                 img.save(filepath, format="PNG")
#                 return jsonify({"logoUrl": "/api/uploads/logo.png"}), 200
#             except Exception as e:
#                 return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

#         return jsonify({"error": "Invalid file type"}), 400

#     # GET: Return path to logo.png if exists
#     filepath = os.path.join(UPLOAD_FOLDER, "logo.png")
#     if os.path.exists(filepath):
#         return jsonify({"logoUrl": "/api/uploads/logo.png"})
#     return jsonify({"logoUrl": ""})

# @logo_bp.route("/uploads/<filename>")
# def serve_logo(filename):
#     return send_from_directory(UPLOAD_FOLDER, filename)
