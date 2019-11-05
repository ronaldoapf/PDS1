import pandas as pd
import numpy as np

#criar arquivo txt baseado na planilha de indice
def gerarIndiceTXT(dict):
       f = open("dict.txt","w")       
       for k, v in dict.items():
            f.write(str(k) + ' : '+ str(v) + '\n\n')
        
       f.close()
       
#Abrir planilhas em csv
def abrirPlanilha(diretorio):
       return pd.read_csv(diretorio, delimiter=",")

#Salvar planilhas em diretorio padrão
def salvarPlanilha(dataFrame,nomePlanilha):
       dataFrame.to_csv(nomePlanilha + ".csv", sep='\t', encoding='utf-8')
        
def filtrarCamposRenomear(df, lista_mudar):
        for colunas in lista_mudar.keys: 
            df.columns[colunas] = lista_mudar[colunas]     
        return df
        
def substituirColunas(df,list_columns):
        df.rename(columns={"cod_uf": "a"})
        return df


planilha = abrirPlanilha("C:\Users\joao\PDS1\dev\csv\Basico_MG.csv")
salvarPlanilha(planilha, "teste")
"""
planilha = pd.read_csv("C:\Users\joao\PDS1\dev\csv\Basico_MG.csv", delimiter=",")
indice_csv = pd.read_csv("C:\Users\joao\PDS1\dev\csv\indice.csv", delimiter=",")

#deixando o nome das colunas todos em minusculo
planilha.columns = planilha.columns.str.lower()

#criando dicionario da planilha de indices
dict_indice = indice_csv.set_index('chave')['valor'].to_dict() 

print(planilha.situacao)


print(planilha.situacao)
print(dict_indice)

#criar arquivo txt baseado na planilha de indices
gerarIndiceTXT(dict_indice)

#teste salvar planilha csv
salvarPlanilhaCSV(planilha, "teste.csv")

#filtrar colunas
planilha2 = filtrarCamposRenomiar(planilha, dict_indice)

#teste substituirColunas
planilha = substituirColunas(planilha)
"""
