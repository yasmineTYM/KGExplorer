import spacy
import nltk, pandas as pd, numpy as np
from nltk.parse.corenlp import CoreNLPParser, CoreNLPDependencyParser
from nltk.tree import ParentedTree
import re
from stanfordcorenlp import StanfordCoreNLP
import ast
from nltk.stem import PorterStemmer
import nltk
from nltk import Tree # $ pip install nltk
import inflect
from nltk.stem import WordNetLemmatizer
# import scispacy
# import spacy
# import en_core_sci_sm   #The model we are going to use
# from spacy import displacy
# from scispacy.abbreviation import AbbreviationDetector
# from scispacy.umls_linking import UmlsEntityLinker


nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('omw-1.4')

def tree2dict(tree):
    print(tree)
    return {tree.node: [tree2dict(t)  if isinstance(t, Tree) else t
                        for t in tree]}

def returnEnt(text):
    sentences = nltk.sent_tokenize(text)
    sentences = [nltk.word_tokenize(sent) for sent in sentences]
    sentences = [nltk.pos_tag(sent) for sent in sentences]
    grammer = r"""
    YAMEI: {<JJ.*>+<NN.*>+}
    {<NN.*>+<NN.*>+}

    """
    cp = nltk.RegexpParser(grammer)
    result = cp.parse(sentences[0])
    ps = PorterStemmer()
    lemmatizer = WordNetLemmatizer()
    phrases = []
    for ele in result:
        if isinstance(ele[0], tuple):
            phrase = ele
            output = ""
            for p in phrase:
                temp = lemmatizer.lemmatize(p[0]).lower()
                output+=str(temp)+" "
            output = output.strip()
            phrases.append(output)
    return phrases


def extractor(df, col, encoder):
    

    phrase_id = 0
    output = {}
    label2phrase = {}
    phrase_id_list = []
    if encoder=="noun phrase":
        for index, row in df.iterrows():
            text = row[col]
            phrases = returnEnt(text)
            one_doc_id_list = []
            for p in phrases:
                one_doc_id_list.append(phrase_id)
                output[phrase_id] = {
                    'doc_id': index,
                    'phrase': p,
                    'label': 'default',
                    'embedding': [],
                    'embeding_umap': []
                }
                if 'default' in label2phrase:
                    label2phrase['default'].append(phrase_id)
                else:
                    label2phrase['default'] = [phrase_id]
                phrase_id +=1
            phrase_id_list.append(one_doc_id_list)
        
    elif encoder == "medical" or encoder=="ner":
        if encoder == "medical":
            NER = spacy.load("en_core_sci_lg")
        else:
            NER = spacy.load("en_core_web_sm")
        for index, row in df.iterrows():
            text = row[col]
            text1 = NER(text)
            one_doc_id_list = []
            for word in text1.ents:
                one_doc_id_list.append(phrase_id)
                output[phrase_id] = {
                    'doc_id': index,
                    'phrase': word.text,
                    'label': word.label_,
                    'embedding': [],
                    'embeding_umap': []
                }
                phrase_id+=1
                if word.label_ in label2phrase:
                    label2phrase[word.label_].append(phrase_id)
                else:
                    label2phrase[word.label_] = [phrase_id]
            phrase_id_list.append(one_doc_id_list)
    df['ExtOutput'] = phrase_id_list
    return {
        'currentLabel': output, 
        'dataset': df.to_dict(orient="records"),
        'label2phrase': label2phrase
    } 