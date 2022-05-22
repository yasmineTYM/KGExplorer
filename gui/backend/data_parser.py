import numpy as np
import pandas as pd
import json
def csv_parser(file_path):
    csv_sheetname = "Current"
    data_df = pd.read_csv(file_path, index_col=0)
    data_df = data_df.fillna('')
    output = data_df.to_dict(orient='records')
    
    return output 

def json_parser(file_path): 
    data = []
    try:
        with open (file_path, 'r') as f:
            data = json.load(f)
        return data
    except: 
        return data  
    
    
