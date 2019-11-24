class Planilha {
    constructor(dir, ind, col, col_decodificadas, col_selecionas) {
        this.diretorio = dir;
        this.indice = ind;
        this.colunas = col;
        this.colunas_decodificadas = col_decodificadas;
        this.colunas_selecionadas = col_selecionas;
        this.getRelation = function(){
            let arr = {};
            for(i=0;i<this.colunas.length;i++){
                arr[this.colunas[i]] = i;
                arr[this.colunas_decodificadas[i]] = i;
            }
            return arr;
        }
    }


}