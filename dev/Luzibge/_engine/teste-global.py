# -*- coding: utf-8 -*-

import sys
import pandas as pd
import json
import string
#import request

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
        i = nomeArquivo.lower().split("_")[0] + "_" + column.lower()
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

def processarRequest(request):

    if request['opcao'] == 1:
        dir = request["dir_planilha"]
        df = carregarCsvEmDataframe(dir)
        columns = df.columns
        response = {
            "opcao": 1,
            "colunas": columns.tolist()
        }
        print (json.dumps( response ))
    
    #retornar  colunas de uma planilha decodificada
    if request["opcao"] == 2:
        dir_planilha = request["dir_planilha"]
        dir_indice = request["dir_indice"]
        nome_planilha = dir_planilha.split('\\')[-1]
        
        colunnas_decodificadas = decodificarColunasDeDataframe(nome_planilha, carregarCsvEmDataframe(dir_planilha), gerarDictIndice(dir_indice))
        response = {
            "opcao": 2,
            "colunas_decodificadas": colunnas_decodificadas
        }
        print (json.dumps( response ))

    #Retirar colunas não selecionadas     
    if request["opcao"] == 3:
        colunas_remover = request["colunas_remover"]
        print(removerColunasDoDataframe(df ,colunas_remover))
        #enviarJson(removerColunasDoDataframe(df ,colunas_remover))
        
### MAIN
# pegando json\

if __name__ == "__main__":
    if sys.argv[1]:
        x = sys.argv[1]
        print(x)
        x = json.loads(x)

        processarRequest(x)
        sys.stdout.flush()
