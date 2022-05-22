from flask import Flask, jsonify,request, Response
from flask_cors import CORS
import json
import time
####
#from corenlp import getPhrase
####
import pandas as pd 
from data_parser import csv_parser, json_parser

# configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)


# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})



@app.route('/getTable', methods=['POST'])
def getTable():
    filename = request.get_json()['filename']
    output = csv_parser('./data/'+filename)
    # print(type(output))
    ## currently we only show the tables with defined ontology 
    return Response(json.dumps(output), status=200, mimetype="application/json")



if __name__ == '__main__':
    app.run(port=5000)