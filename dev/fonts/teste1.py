# -*- coding: utf-8 -*-
"""
Created on Tue Oct  8 16:38:10 2019

@author: Henri
"""

import pandas as pd
import numpy as np

def carregarPlanilhasArray():
    	sheets = pd.read_csv("../csv/Basico_MG.csv", index_col=0)
        return sheets

def carregarPlanilhaIndice():
        x = np.genfromtxt('../fonts/indices.doc',dtype='str')
        return x
        
sheets = carregarPlanilhasArray()
x = carregarPlanilhaIndice()
print(sheets)	
print(x)
