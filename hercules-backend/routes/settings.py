# # hercules-backend/routes/settings.py
# from flask import Blueprint, request, send_from_directory, jsonify
# import os
# import json
# import smtplib

# settings_bp = Blueprint('settings_bp', __name__)
# UPLOAD_FOLDER = 'uploads/logos'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @settings_bp.route('/api/settings/logo', methods=['POST'])
# def upload_logo():
#     if 'logo' not in request.files:
#         return jsonify({'error': 'No file uploaded'}), 400
#     file = request.files['logo']
#     path = os.path.join(UPLOAD_FOLDER, 'nfm_logo.png')
#     file.save(path)
#     return jsonify({'message': 'Logo uploaded'}), 200

# @settings_bp.route('/api/settings/logo', methods=['GET'])
# def get_logo():
#     return send_from_directory(UPLOAD_FOLDER, 'nfm_logo.png')

# @settings_bp.route('/api/settings/logo', methods=['DELETE'])
# def delete_logo():
#     try:
#         os.remove(os.path.join(UPLOAD_FOLDER, 'nfm_logo.png'))
#         return jsonify({'message': 'Logo deleted'}), 200
#     except FileNotFoundError:
#         return jsonify({'error': 'Logo not found'}), 404


# @settings_bp.route('/api/settings/smtp', methods=['POST'])
# def save_smtp_settings():
#     config = request.json
#     with open('smtp_config.json', 'w') as f:
#         json.dump(config, f)
#     return jsonify({'message': 'SMTP settings saved'}), 200

# @settings_bp.route('/api/settings/send-test-email', methods=['POST'])
# def send_test_email():
#     try:
#         with open('smtp_config.json', 'r') as f:
#             config = json.load(f)

#         server = smtplib.SMTP(config['host'], config['port'])
#         server.starttls()
#         server.login(config['username'], config['password'])
#         message = "Subject: Test Email from NFM\n\nThis is a test email from NFM."
#         server.sendmail(config['sender'], config['recipient'], message)
#         server.quit()

#         return jsonify({'message': 'Test email sent'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500




# hercules-backend/routes/settings.py

# from flask import Blueprint, request, send_from_directory, jsonify
# import os
# import json
# import smtplib

# settings_bp = Blueprint('settings_bp', __name__)
# UPLOAD_FOLDER = 'uploads/logos'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # -------------------- LOGO MANAGEMENT --------------------

# @settings_bp.route('/api/settings/logo', methods=['POST'])
# def upload_logo():
#     if 'logo' not in request.files:
#         return jsonify({'error': 'No file uploaded'}), 400
#     file = request.files['logo']
#     path = os.path.join(UPLOAD_FOLDER, 'nfm_logo.png')
#     file.save(path)
#     return jsonify({'message': 'Logo uploaded', 'logoUrl': f'/uploads/nfm_logo.png'}), 200

# @settings_bp.route('/api/settings/logo', methods=['GET'])
# def get_logo():
#     return send_from_directory(UPLOAD_FOLDER, 'nfm_logo.png')

# @settings_bp.route('/api/settings/logo', methods=['DELETE'])
# def delete_logo():
#     try:
#         os.remove(os.path.join(UPLOAD_FOLDER, 'nfm_logo.png'))
#         return jsonify({'message': 'Logo deleted'}), 200
#     except FileNotFoundError:
#         return jsonify({'error': 'Logo not found'}), 404

# # -------------------- SINGLE SMTP CONFIG (LEGACY SUPPORT) --------------------

# @settings_bp.route('/api/settings/smtp', methods=['POST'])
# def save_smtp_settings():
#     config = request.json
#     with open('smtp_config.json', 'w') as f:
#         json.dump(config, f)
#     return jsonify({'message': 'SMTP settings saved'}), 200

# @settings_bp.route('/api/settings/send-test-email', methods=['POST'])
# def send_test_email_legacy():
#     try:
#         with open('smtp_config.json', 'r') as f:
#             config = json.load(f)

#         recipient = config.get("recipient")
#         if not recipient:
#             return jsonify({'error': 'Recipient email missing'}), 400

#         server = smtplib.SMTP(config['host'], config['port'])
#         server.starttls()
#         server.login(config['username'], config['password'])

#         message = "Subject: Test Email from NFM\n\nThis is a test email from NFM."
#         server.sendmail(config['sender'], recipient, message)
#         server.quit()

#         return jsonify({'message': 'Test email sent (legacy config)'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # -------------------- MULTI-PROFILE SMTP SUPPORT --------------------

# PROFILE_PATH = 'smtp_profiles.json'

# def load_profiles():
#     if not os.path.exists(PROFILE_PATH):
#         return {"active": "", "profiles": {}}
#     with open(PROFILE_PATH, 'r') as f:
#         return json.load(f)

# def save_profiles(data):
#     with open(PROFILE_PATH, 'w') as f:
#         json.dump(data, f, indent=2)

# @settings_bp.route('/api/settings/smtp-profiles', methods=['GET'])
# def get_smtp_profiles():
#     return jsonify(load_profiles())

# @settings_bp.route('/api/settings/smtp-profiles', methods=['POST'])
# def add_smtp_profile():
#     new_profile = request.json
#     name = new_profile.get('name')
#     if not name:
#         return jsonify({'error': 'Profile name is required'}), 400
#     data = load_profiles()
#     data['profiles'][name] = new_profile
#     save_profiles(data)
#     return jsonify({'message': f'Profile "{name}" added.'}), 200

# @settings_bp.route('/api/settings/smtp-profiles/activate', methods=['POST'])
# def activate_smtp_profile():
#     name = request.json.get('name')
#     data = load_profiles()
#     if name not in data['profiles']:
#         return jsonify({'error': 'Profile not found'}), 404
#     data['active'] = name
#     save_profiles(data)
#     return jsonify({'message': f'Profile "{name}" activated.'}), 200

# @settings_bp.route('/api/settings/send-test-email', methods=['POST'])
# def send_test_email_from_active_profile():
#     try:
#         data = load_profiles()
#         profile_name = data.get('active')
#         recipient = request.json.get('recipient')

#         if not profile_name:
#             return jsonify({'error': 'No active profile selected'}), 400
#         profile = data['profiles'].get(profile_name)
#         if not profile:
#             return jsonify({'error': 'Active profile data not found'}), 404
#         if not recipient:
#             return jsonify({'error': 'Recipient email required'}), 400

#         server = smtplib.SMTP(profile['host'], profile['port'])
#         server.starttls()
#         server.login(profile['username'], profile['password'])

#         message = "Subject: Test Email from NFM\n\nThis is a test email from the selected SMTP profile."
#         server.sendmail(profile['sender'], recipient, message)
#         server.quit()

#         return jsonify({'message': f'Test email sent using "{profile_name}"'}), 200
#     except Exception as e:
#         print("SMTP ERROR:", str(e))
#         return jsonify({'error': str(e)}), 500









# hercules-backend/routes/settings.py

from flask import Blueprint, request, send_from_directory, jsonify
import os
import json
import smtplib

settings_bp = Blueprint('settings_bp', __name__)
UPLOAD_FOLDER = 'uploads/logos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------------- LOGO MANAGEMENT --------------------

@settings_bp.route('/settings/logo', methods=['POST'])
def upload_logo():
    if 'logo' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['logo']
    path = os.path.join(UPLOAD_FOLDER, 'nfm_logo.png')
    file.save(path)
    return jsonify({'message': 'Logo uploaded', 'logoUrl': f'/uploads/nfm_logo.png'}), 200

@settings_bp.route('/settings/logo', methods=['GET'])
def get_logo():
    return send_from_directory(UPLOAD_FOLDER, 'nfm_logo.png')

@settings_bp.route('/settings/logo', methods=['DELETE'])
def delete_logo():
    try:
        os.remove(os.path.join(UPLOAD_FOLDER, 'nfm_logo.png'))
        return jsonify({'message': 'Logo deleted'}), 200
    except FileNotFoundError:
        return jsonify({'error': 'Logo not found'}), 404

# -------------------- SINGLE SMTP CONFIG (LEGACY SUPPORT) --------------------

@settings_bp.route('/settings/smtp', methods=['POST'])
def save_smtp_settings():
    config = request.json
    with open('smtp_config.json', 'w') as f:
        json.dump(config, f)
    return jsonify({'message': 'SMTP settings saved'}), 200

# @settings_bp.route('/settings/send-test-email', methods=['POST'])
# def send_test_email_legacy():
#     try:
#         with open('smtp_config.json', 'r') as f:
#             config = json.load(f)

#         recipient = config.get("recipient")
#         if not recipient:
#             return jsonify({'error': 'Recipient email missing'}), 400

#         server = smtplib.SMTP(config['host'], config['port'])
#         server.starttls()
#         server.login(config['username'], config['password'])

#         message = "Subject: Test Email from NFM\n\nThis is a test email from NFM."
#         server.sendmail(config['sender'], recipient, message)
#         server.quit()

#         return jsonify({'message': 'Test email sent (legacy config)'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# -------------------- MULTI-PROFILE SMTP SUPPORT --------------------

PROFILE_PATH = 'smtp_profiles.json'

def load_profiles():
    if not os.path.exists(PROFILE_PATH):
        return {"active": "", "profiles": {}}
    with open(PROFILE_PATH, 'r') as f:
        return json.load(f)

def save_profiles(data):
    with open(PROFILE_PATH, 'w') as f:
        json.dump(data, f, indent=2)

@settings_bp.route('/settings/smtp-profiles', methods=['GET'])
def get_smtp_profiles():
    return jsonify(load_profiles())

@settings_bp.route('/settings/smtp-profiles', methods=['POST'])
def add_smtp_profile():
    new_profile = request.json
    name = new_profile.get('name')
    if not name:
        return jsonify({'error': 'Profile name is required'}), 400
    data = load_profiles()
    data['profiles'][name] = new_profile
    save_profiles(data)
    return jsonify({'message': f'Profile "{name}" added.'}), 200

@settings_bp.route('/settings/smtp-profiles/activate', methods=['POST'])
def activate_smtp_profile():
    name = request.json.get('name')
    data = load_profiles()
    if name not in data['profiles']:
        return jsonify({'error': 'Profile not found'}), 404
    data['active'] = name
    save_profiles(data)
    return jsonify({'message': f'Profile "{name}" activated.'}), 200

@settings_bp.route('/settings/send-test-email', methods=['POST'])
def send_test_email_from_active_profile():
    try:
        data = load_profiles()
        profile_name = data.get('active')
        recipient = request.json.get('recipient')

        if not profile_name:
            return jsonify({'error': 'No active profile selected'}), 400
        profile = data['profiles'].get(profile_name)
        if not profile:
            return jsonify({'error': 'Active profile data not found'}), 404
        if not recipient:
            return jsonify({'error': 'Recipient email required'}), 400

        server = smtplib.SMTP(profile['host'], profile['port'])
        server.starttls()
        server.login(profile['username'], profile['password'])

        message = "Subject: Test Email from NFM\n\nThis is a test email from the selected SMTP profile."
        server.sendmail(profile['sender'], recipient, message)
        server.quit()

        return jsonify({'message': f'Test email sent using "{profile_name}"'}), 200
    except Exception as e:
        print("SMTP ERROR:", str(e))
        return jsonify({'error': str(e)}), 500
