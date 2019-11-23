# -*- coding: utf-8 -*-

import sys
import pandas as pd
import json
import string


def gerarIndiceTXT(diretorio, frase):
    f = open(diretorio,"a+")
    f.write(frase)
    f.close()

def gerarDictIndice(dir_csv_indice):
    indice_csv = pd.read_csv(dir_csv_indice, delimiter=",")
    dict_indice = indice_csv.set_index('chave')['valor'].to_dict() 
    return dict_indice
       
def salvarPlanilhaCSV(dataframe,diretorio):
    dataframe.to_csv(diretorio,index=False, sep='\t', encoding='utf-8')

def carregarCsvEmDataframe(dir_csv):
    dataframe = pd.read_csv(dir_csv, delimiter=",")
    dataframe.columns = toLowerCase(dataframe.columns)
    return dataframe

def decodificarColunasDeDataframe(nomeArquivo, dataframe, dict_indice):
    c = []
    for column in dataframe.columns:
        i = nomeArquivo.lower().split("_")[0] + "_" + column.lower()
        if(i in dict_indice):
            c.append(dict_indice[i])
        else:
            c.append(column.lower())
    return c

def renomearColunasDoDataframe(dataframe, novas_colunas):
    dataframe.columns = novas_colunas
    return dataframe

def removerColunasDoDataframe(dataframe, cols):
    for col in cols:
        dataframe = dataframe.drop(col, axis=1)
        
    return dataframe
    
def getColunasNaoUtilizadas(colunas_totais, colunas_utilizadas):
    for i in reversed(colunas_utilizadas):
        del colunas_totais[i]
    return colunas_totais

def decodificarValoresDoDataframe(dataframe, dict_indices):
    indices = list(dict_indices.keys())
    colunas = list(dataframe.columns)
    for coluna in colunas:
        idx = [i for i in indices if coluna in i]
        aux = [s for s in idx if len(s.split("_")) > 2]
        if(aux):
            values = list(map(int,[i.split("_")[-1] for i in idx]))
            dic = dict(zip(values,[dict_indices[i] for i in idx]))
            
            dataframe[coluna] = dataframe[coluna].map(dic)
    
    return dataframe
    
def toLowerCase(strings):
    x = []
    for s in strings:
        x.append(s.lower())
        
    return x

def processarRequest(request):
    if request["opcao"] == 1:
        dir_planilha = request["dir_planilha"]
        dir_indice = request["dir_indice"]
        nome_planilha = dir_planilha.split('\\')[-1]
        
        df = carregarCsvEmDataframe(dir_planilha)
        colunas = df.columns
        colunnas_decodificadas = decodificarColunasDeDataframe(nome_planilha, df, gerarDictIndice(dir_indice))
        response = {
            "opcao": 1,
            "colunas": colunas.tolist(),
            "colunas_decodificadas": colunnas_decodificadas
        }
        print (json.dumps( response ))
    
    elif request["opcao"] == 2:
        dir_planilha = request["dir_salvar"]
        colunas_selecionadas = request["colunas_selecionadas"]
        
        print (json.dumps( colunas_selecionadas ))
        
### MAIN
# pegando json\

if __name__ == "__main__":
    if sys.argv[1]:
        x = sys.argv[1]
        x = json.loads(x)

        processarRequest(x)
        sys.stdout.flush()