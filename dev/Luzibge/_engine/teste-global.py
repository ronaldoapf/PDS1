# -*- coding: utf-8 -*-

import sys
import pandas as pd
import json
import string

def gerarIndiceTXT(diretorio, frase):
    f = open(diretorio,"a+")
    f.write(frase)
    f.close()
       
def salvarPlanilhaCSV(df,file_name):
    df.to_csv(file_name, sep='\t', encoding='utf-8')
        
def gerarDictIndice(dir_csv_indice):
    indice_csv = pd.read_csv(dir_csv_indice, delimiter=",")
    dict_indice = indice_csv.set_index('chave')['valor'].to_dict() 
    return dict_indice

def carregarCsvEmDataframe(dir_csv):
    return pd.read_csv(dir_csv, delimiter=",")

def decodificarColunasDeDataframe(nomeArquivo, dataframe, dict_indice):
    c = []
    for column in dataframe.columns:
        i = nomeArquivo + "_" + column.lower()
        if(i in dict_indice):
            c.append(dict_indice[i])
        else:
            c.append(column.lower())
    return c

def removerColunasDoDataframe(dataframe, cols):
    return dataframe.drop(columns=cols)
    
def toLowerCase(strings):
    x = []
    for s in strings:
        x.append(s.lower())
        
    return x

def processarRequest(r_json):
    if x["opcao"] == 1:
        for i in x["indice"]:
            indice = gerarDictIndice(i)

        for p in x["planilhas"]:
            df = carregarCsvEmDataframe(p)
            
            nome_arquivo = p.split('\\')[-1].lower()
            nome_arquivo = nome_arquivo.split("_")[0]
            
            print(decodificarColunasDeDataframe(nome_arquivo,df,indice))

### MAIN
# pegando json
x = sys.argv[1]
x = json.loads(x, encoding="utf-8")
processarRequest(x)
sys.stdout.flush()