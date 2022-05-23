from flask import Flask, jsonify,request, Response
from flask_cors import CORS
import json
import time
####
#from corenlp import getPhrase
####
import pandas as pd 
# from data_parser import csv_parser, json_parser
import data_parser
import kg_creator
# configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)


# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


# KG Creator 
## loadtext.js
@app.route('/getTable', methods=['POST'])
def getTable():
    filename = request.get_json()['filename']
    output = data_parser.csv_parser('./data/'+filename)
    # print(type(output))
    ## currently we only show the tables with defined ontology 
    return Response(json.dumps(output), status=200, mimetype="application/json")

## extractor.js 
@app.route('/extractor', methods=['POST'])
def extractor():
    dataset = request.get_json()['dataset']
    embedColumn = request.get_json()['embedColumn']
    encoder = request.get_json()['encoder']

    dfItem = data_parser.json2df(dataset)
    
    output = kg_creator.extractor(dfItem, embedColumn, encoder)

    
    return Response(json.dumps(output), status=200, mimetype="application/json")



if __name__ == '__main__':
    app.run(port=5000)