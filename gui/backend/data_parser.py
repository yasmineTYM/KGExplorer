import numpy as np
import pandas as pd
import json
from io import StringIO
def csv_parser(file_path):
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

def json2df(jsondata):
    ## json is from to_dict 
    temp = []
    for key in jsondata['data']:
        temp.append(jsondata['data'][key])
    output = pd.io.json.json_normalize({'data':temp}, record_path = ['data'])
    return output 
    
    
