import pandas as pd

#criar arquivo txt baseado na planilha de indice
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


planilha = carregarCsvEmDataframe("../csv/Descrição dos Setores_MG.csv")
planilha.columns = planilha.columns.str.lower()


idx = gerarDictIndice("../csv/indice.csv")

planilha.columns = decodificarColunasDeDataframe("basico",planilha, idx)

print(planilha.head())

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