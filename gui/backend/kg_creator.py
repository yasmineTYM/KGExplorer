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

def parseOneSent(sent, starting_from, raw_sent):
    grammer = r"""
    YAMEI: {<JJ.*>+<NN.*>+}
    {<NN.*>+<NN.*>+}

    """
    cp = nltk.RegexpParser(grammer)
    result = cp.parse(sent)
    ps = PorterStemmer()
    lemmatizer = WordNetLemmatizer()
    phrases = []
    for ele in result:
        if isinstance(ele[0], tuple):
            phrase = ele
            output = ""
            for p in phrase:
                # temp = lemmatizer.lemmatize(p[0]).lower()
                temp = p[0].lower()
                output+=str(temp)+" "
            output = output.strip()
            s_ = raw_sent.lower().find(output) + starting_from
            e_ = s_ + len(output)
            phrases.append((output, s_, e_))
    return phrases 
def returnEnt(text):
    splits = nltk.sent_tokenize(text)
    
    sentences = [nltk.word_tokenize(sent) for sent in splits]
    posInfo = [nltk.pos_tag(sent) for sent in sentences]
    
    phrases_all = []
    
    pointer = 0
#     for i in range(len(sentences)):
    i=0
    while i<len(posInfo):
        phrases = parseOneSent(posInfo[i], pointer, splits[i])
        pointer += len(splits[i])+1
        i+=1
        phrases_all += phrases 
    # print(phrases_all)
    # TODO: extract repeat phrases in different sentences. Locate their position. currently, i just keep the phrases appearing first time.
    return list(set(phrases_all))


def extractor(df, col, encoder):
    phrase_id = 0
    output = {}
    label2phrase = {}
    phrase_id_list = []
    unique_labels = []
    if encoder=="noun phrase":
        unique_labels = ['Entity']
        for index, row in df.iterrows():
            text = row[col]
            phrases = returnEnt(text)
            one_doc_id_list = []
            for p in phrases:
                one_doc_id_list.append(phrase_id)
                default = 'Entity'
                output[phrase_id] = {
                    'doc_id': index,
                    'phrase': p[0],
                    'label': default,
                    'embedding': [],
                    'embeding_umap': [],
                    'startOffset': p[1],
                    'endOffset': p[2]
                }
                if default in label2phrase:
                    label2phrase[default].append(phrase_id)
                else:
                    label2phrase[default] = [phrase_id]
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
            pointer = 0
            for word in text1.ents:
                one_doc_id_list.append(phrase_id)
                unique_labels.append(word.label_)
                starting_offset = text[pointer:].find(word.text) + pointer
                ending_offset = starting_offset + len(word.text)
                
                output[phrase_id] = {
                    'doc_id': index,
                    'phrase': word.text,
                    'label': word.label_,
                    'embedding': [],
                    'embeding_umap': [],
                    'startOffset': starting_offset,
                    'endOffset': ending_offset
                }
                pointer = ending_offset
                phrase_id+=1
                if word.label_ in label2phrase:
                    label2phrase[word.label_].append(phrase_id)
                else:
                    label2phrase[word.label_] = [phrase_id]
            phrase_id_list.append(one_doc_id_list)
        unique_labels = list(set(unique_labels))
    df['ExtOutput'] = phrase_id_list
    return {
        'currentLabel': output, 
        'dataset': df.to_dict(orient="records"),
        'label2phrase': label2phrase,
        'uniqueLabels': unique_labels
    } 