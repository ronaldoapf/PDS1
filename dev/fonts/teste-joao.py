import pandas as pd
import numpy as np

#criar arquivo txt baseado na planilha de indice
def gerarIndiceTXT(diretorio, frase):
       f = open(diretorio,"a+")
       f.write(frase)
       f.close()
       
def salvarPlanilhaCSV(df,file_name):
        df.to_csv(file_name, sep='\t', encoding='utf-8')
        
def filtrarCamposRenomiar(df, lista_mudar):
        for colunas in lista_mudar.keys: 
            df.columns[colunas] = lista_mudar[colunas]     
        return df
        
def substituirColunas(df,list_columns):
        df.rename(columns={"cod_uf": "a"})
        return df

planilha = pd.read_csv("C:\Users\joao\PDS1\dev\csv\Basico_MG.csv", delimiter=",")
indice_csv = pd.read_csv("C:\Users\joao\PDS1\dev\csv\indice.csv", delimiter=",")

#deixando o nome das colunas todos em minusculo
planilha.columns = planilha.columns.str.lower()

#criando dicionario da planilha de indices
dict_indice = indice_csv.set_index('chave')['valor'].to_dict() 

print(planilha.situacao)

for val in planilha.situacao.unique():
    indx = "basico_uf_" + "situacao_" + str(val)
    planilha.situacao[planilha.situacao == val] = dict_indice[indx]

print(planilha.situacao)
print(dict_indice)

#criar arquivo txt baseado na planilha de indices
for key, value in dict_indice.items(): 
    gerarIndiceTXT("indice.txt",' \n' + 'Código: ' + key + ' Valor: ' + value)

#teste salvar planilha csv
salvarPlanilhaCSV(planilha, "teste.csv")

#filtrar colunas
planilha2 = filtrarCamposRenomiar(planilha, dict_indice)

#teste substituirColunas
planilha = substituirColunas(planilha)