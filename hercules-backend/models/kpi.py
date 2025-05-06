from extensions import db
class KPI(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    batch_guid = db.Column(db.String(50), nullable=False, unique=True)
    batch_name = db.Column(db.String(255), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    batch_act_start = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "batch_guid": self.batch_guid,
            "batch_name": self.batch_name,
            "product_name": self.product_name,
            "batch_act_start": self.batch_act_start
        }
