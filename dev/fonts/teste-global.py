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
    
def toLowerCase(strings):
    x = []
    for s in strings:
        x.append(s.lower())
        
    return x

def decodificarValoresDaColuna(df, colunas, indices):
    for coluna in colunas:
        idx = [i for i in indices.keys() if coluna in i] 
        if(idx):
            values = list(map(int,[i.split("_")[-1] for i in idx]))
            dic = dict(zip(values,[indices[i] for i in idx]))
            
            
            df[coluna] = df[coluna].map(dic)
    
    return df
    
            
#carregando indices
idx = gerarDictIndice("../csv/indice.csv")
#print(idx)
#carregando csv de  teste
df = carregarCsvEmDataframe("../csv/Basico_MG.csv")
#colocando caracteres das colunas para minusculo
df.columns = toLowerCase(df.columns)

#colunas removidas
del_cols = ['cod_uf', 'nome_da_uf', 'cod_meso', 'nome_da_meso',
       'cod_micro', 'nome_da_micro', 'cod_rm', 'nome_da_rm', 'cod_municipio',
       'nome_do_municipio', 'cod_distrito',
       'cod_subdistrito', 'nome_do_subdistrito','nome_do_distrito', 'cod_bairro',
       'nome_do_bairro', 'var01', 'var02',
       'var03', 'var04', 'var05', 'var06', 'var07', 'var08', 'var09', 'var10',
       'var11', 'var12', 'var13']
#removendo colunas
df = removerColunasDoDataframe(df,del_cols)

#decodificando colunas
df.columns = decodificarColunasDeDataframe("basico", df, idx)

#decodificando valores das colunas que restaram
df = decodificarValoresDaColuna(df, df.columns, idx)
print(df)