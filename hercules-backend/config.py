import os

class Config:
    
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:0000@localhost:3306/hercules_kpi"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
