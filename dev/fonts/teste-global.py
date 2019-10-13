import pandas as pd

#criar arquivo txt baseado na planilha de indice
def gerarIndiceTXT(diretorio, frase):
    f = open(diretorio,"a+")
    f.write(frase)
    f.close()
       
def salvarPlanilhaCSV(df,file_name):
    df.to_csv(file_name, sep='\t', encoding='utf-8')
        
def gerar_dict_indice(dir_csv_indice):
    indice_csv = pd.read_csv(dir_csv_indice, delimiter=",")
    dict_indice = indice_csv.set_index('chave')['valor'].to_dict() 
    return dict_indice

def carregarCSV(dir_csv):
    return pd.read_csv(dir_csv, delimiter=",")

def toLowerCase(array):
    return

planilha = carregarCSV("../csv/Basico_MG.csv")
#indice_csv = pd.read_csv("../csv/indice.csv", delimiter=",")

#deixando o nome das colunas todos em minusculo
planilha.columns = planilha.columns.str.lower()

#criando dicionario da planilha de indices
#dict_indice = indice_csv.set_index('key')['value'].to_dict() 

#print(dict_indice)

print(luz.gerar_dict_indice("../csv/indice.csv"))

"""

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

"""