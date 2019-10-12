import pandas as pd

planilha = pd.read_csv("./planilhas/Basico_MG.csv", delimiter=",")
indice_csv = pd.read_csv("./pdfs/indice.csv", delimiter=",")

#deixando o nome das colunas todos em minusculo
planilha.columns = planilha.columns.str.lower()

#criando dicionario da planilha de indices
dict_indice = indice_csv.set_index('chave')['valor'].to_dict() 

print(planilha.situacao)

for val in planilha.situacao.unique():
    indx = "basico_uf_" + "situacao_" + str(val)
    planilha.situacao[planilha.situacao == val] = dict_indice[indx]

print(planilha.situacao)