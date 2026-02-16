import pandas as pd
import sys

try:
    file_path = r'C:\Users\monster\Downloads\123.xlsx'
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head(5).to_string())
except Exception as e:
    print(f"Error: {e}")
