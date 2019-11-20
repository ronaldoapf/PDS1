class Planilha {
  constructor(dir,ind,col,col_decodificadas,col_selecionas) {
    this.diretorio = dir;
    this.indice = ind;
    this.colunas = col;
    this.colunas_decodificadas = col_decodificadas;
    this.colunas_selecionadas = col_selecionas;
  }
  present() {
    return "I have a new " + this.diretorio + " color " + this.indice;
  }
}