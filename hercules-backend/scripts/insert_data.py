import pandas as pd
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db

from models.kpi_material import KPIMaterial

# Set your CSV file path here
CSV_FILE_PATH = "/Users/vinodhkumar/Downloads/100_Kpis_BatchMaterials.csv" # Update with the correct path

def insert_csv_data():
    # Read the CSV file into a DataFrame
    df = pd.read_csv(CSV_FILE_PATH)

    df = df.where(pd.notnull(df), None)

    with app.app_context():
        for _, row in df.iterrows():
            # Create a new KPIMaterial instance for each row in the CSV
            kpi_material = KPIMaterial(
                batch_guid=row['Batch GUID'],
                batch_name=row['Batch Name'],
                product_name=row['Product Name'],
                batch_act_start=row['Batch Act Start'],
                batch_act_end=row['Batch Act End'],
                quantity=row['Quantity'],
                material_name=row['Material Name'],
                material_code=row['Material Code'],
                setpoint_float=row['SetPoint Float'],
                actual_value_float=row['Actual Value Float'],
                source_server=row['Source Server'],
                rootguid=row['ROOTGUID'],
                order_id=row['OrderId'],
                event_id=row['EventID'],
                batch_transfer_time=row['Batch Transfer Time'],
                formula_category_name=row['FormulaCategoryName'],
            )

            # Add the instance to the session
            db.session.add(kpi_material)

        # Commit the session to insert the data into the database
        db.session.commit()
        print("✅ Data inserted successfully.")

if __name__ == "__main__":
    insert_csv_data()
