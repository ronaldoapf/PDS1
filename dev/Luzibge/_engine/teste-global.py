import sys
import pandas as pd
import json

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
        i = nomeArquivo + "_" + column
        if(i in dict_indice):
            c.append(dict_indice[i])
        else:
            c.append(column)
    return c

def removerColunasDoDataframe(dataframe, cols):
    return dataframe.drop(columns=cols)
    
def toLowerCase(strings):
    x = []
    for s in strings:
        x.append(s.lower())
        
    return x

print("teste")
# print(sys.argv[1:])
# sys.stdout.flush()