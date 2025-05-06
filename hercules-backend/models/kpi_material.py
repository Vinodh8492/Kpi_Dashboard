from extensions import db

class KPIMaterial(db.Model):
    __tablename__ = 'kpi_material'

    id = db.Column(db.Integer, primary_key=True)
    
    batch_guid = db.Column(db.String(100))                  # UUID
    batch_name = db.Column(db.String(255))                  # Text
    product_name = db.Column(db.String(255))                # Text
    batch_act_start = db.Column(db.DateTime)                # Timestamp
    batch_act_end = db.Column(db.DateTime)                  # Timestamp
    quantity = db.Column(db.Float)                          # Numeric
    material_name = db.Column(db.String(255))               # Text
    material_code = db.Column(db.String(100))               # Usually a string of digits
    setpoint_float = db.Column(db.Float)                    # Float
    actual_value_float = db.Column(db.Float)                # Float
    source_server = db.Column(db.String(100))               # Server name
    rootguid = db.Column(db.String(100))                    # UUID
    order_id = db.Column(db.String(100))                    # Order number or ID
    event_id = db.Column(db.String(100))                    # Event identifier
    batch_transfer_time = db.Column(db.String(100))         # Can be datetime or string (nullable)
    formula_category_name = db.Column(db.String(255))       # Category (nullable)

    def __repr__(self):
        return f"<KPIMaterial {self.batch_name}>"
