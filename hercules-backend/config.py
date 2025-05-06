import os
from sqlalchemy.engine.url import URL
class Config:
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://avnadmin:AVNS_jwZzCIKhK3Fsmofmrso@mysql-vinodh-vinodhrk4-3a70.h.aivencloud.com:21082/defaultdb"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {
            "ssl": {
                "ca": os.path.join(os.path.dirname(__file__), "certs", "ca.pem")
            }
        }
    }