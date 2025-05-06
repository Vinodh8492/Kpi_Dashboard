# hercules-backend/routes/report_scheduler.py

from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

report_bp = Blueprint('report_bp', __name__)
CONFIG_PATH = 'report_config.json'
SMTP_PROFILE_PATH = 'smtp_profiles.json'

# Start the scheduler
scheduler = BackgroundScheduler()
scheduler.start()

# Load and save config

def load_config():
    if not os.path.exists(CONFIG_PATH):
        return {}
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def save_config(data):
    with open(CONFIG_PATH, 'w') as f:
        json.dump(data, f, indent=2)

# Scheduled job logic

def send_report():
    report_config = load_config()
    now = datetime.now().strftime('%Y-%m-%d %H:%M')

    if not os.path.exists(SMTP_PROFILE_PATH):
        print("❌ SMTP profile config not found")
        return

    with open(SMTP_PROFILE_PATH, 'r') as f:
        smtp_data = json.load(f)

    profile_name = smtp_data.get("active")
    profile = smtp_data.get("profiles", {}).get(profile_name)

    if not profile:
        print("❌ Active SMTP profile is missing")
        return

    sender = profile.get("sender")
    recipient = report_config.get("recipient")
    include = report_config.get("include", {})

    print(f"[⏰ {now}] Sending report from {sender} to {recipient}")
    print("✅ Includes:", include)

    html = f"""
    <html>
      <body>
        <h2>NFM Daily Report - {now}</h2>
        <p>This report includes:</p>
        <ul>
          {'<li>KPIs</li>' if include.get('kpis') else ''}
          {'<li>Charts</li>' if include.get('charts') else ''}
          {'<li>Data Table</li>' if include.get('table') else ''}
        </ul>
        <p>This is an auto-generated email from NFM.</p>
      </body>
    </html>
    """

    try:
        server = smtplib.SMTP(profile["host"], int(profile["port"]))
        server.starttls()
        server.login(profile["username"], profile["password"])

        msg = MIMEMultipart('alternative')
        msg['Subject'] = "📊 NFM Daily Report"
        msg['From'] = sender
        msg['To'] = recipient
        msg.attach(MIMEText(html, 'html'))

        server.sendmail(sender, recipient, msg.as_string())
        server.quit()

        print("✅ Email sent using profile:", profile_name)
    except Exception as e:
        print(f"❌ Failed to send report email: {e}")

# Schedule job

def schedule_report_job(config):
    scheduler.remove_all_jobs()
    if config.get("enabled"):
        try:
            hour, minute = map(int, config['time'].split(':'))
            trigger = CronTrigger(hour=hour, minute=minute)
            scheduler.add_job(send_report, trigger, id='daily_report')
            print(f"[✔] Report job scheduled daily at {config['time']}")
        except Exception as e:
            print(f"[⚠] Failed to schedule report job: {e}")
    else:
        print("[ℹ] Email scheduling is disabled.")

# Routes

@report_bp.route('/settings/report-config', methods=['POST'])
def save_report_config():
    config = request.json
    save_config(config)
    schedule_report_job(config)
    return jsonify({"message": "Report schedule saved"}), 200

@report_bp.route('/settings/report-config', methods=['GET'])
def get_report_config():
    return jsonify(load_config())

