import pandas as pd

indice_csv = pd.read_csv("../csv/indice.csv", delimiter=",")

dict_indice = indice_csv.set_index('chave')['valor'].to_dict() 

print(dict_indice)