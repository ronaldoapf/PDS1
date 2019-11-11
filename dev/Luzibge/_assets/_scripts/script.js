//variaveis globais
var indice;
var planilhas; //pegando planilhas vindas da url
var planilha_atual = ""; //variavel que armazenara qual planilha esta sendo processada será q tem como atualizar ela ?
var indice_col_atual = 0; //variavel que armazenará o indice de quais colunas que estao sendo processadas da planilha atual
var colunas_planilha_atual = [];
var colunas_decodificadas_planilha_atual = [];



function sendRequest(json) {
    var {
        PythonShell
    } = require("python-shell")
    var path = require("path")
    var opcoes = {
        mode: "text",
        encoding: "utf-8",
        pythonOptions: ["-u"],
        scriptPath: path.join(__dirname, '../_engine/'),
        args: [JSON.stringify(json)] ,
        pythonPath: 'C:\\Python\\python.exe'
    }
    var python = new PythonShell('teste-global.py', opcoes);

    var response;
    //quando o arquivo python retornar algo esse evento será disparado
    python.on('message', function(data) {
        if(JSON.parse(data)) {
            data = JSON.parse(data)  
            if (data) {
                if (data.opcao == 1) {
                    response = data.colunas;
                    colunas_planilha_atual = response;
                    //montarDados(response)
                }
                if(data.opcao == 2) {
                    response = data.colunas_decodificadas;
                    colunas_decodificadas_planilha_atual = response;
                }
                if(data.opcao == 3) {
                    indice_col_atual = 0;
                    colunas_planilha_atual = data.colunas
                    colunas_decodificadas_planilha_atual = data.colunas_decodificadas
                    
                    if(colunas_planilha_atual && colunas_decodificadas_planilha_atual) {
                        carregarColunasNaTabela(colunas_planilha_atual, colunas_decodificadas_planilha_atual, indice_col_atual);
                    }
                }
            }
        }
    })
    // return response; 
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

/*async function buscarColunasDePlanilha(dir_planilha) {
    var json = {
        "opcao": 1,
        "dir_planilha": dir_planilha
    };
    await sendRequest(json);
}

async function buscarColunasDecodificadasDePlanilha(dir_planilha, dir_indice) {
    var json = {
        "opcao": 2,
        "dir_planilha": dir_planilha,
        "dir_indice": dir_indice
    };
    await sendRequest(json);
}*/

function buscarColunasCodificadas_Decodificadas(p_atual, p_indice) {
    var json = {
        "opcao": 3,
        "dir_planilha": p_atual,
        "dir_indice": p_indice
    };
    sendRequest(json)
}

//funcao para pegar parametros da url
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

//funcao para pegar o diretório de planilhas que vieram na url
function getPlanilhas() {
    let i = 0;
    let planilhas = [];
    while (getUrlParameter("planilha" + i)) {
        planilhas.push(getUrlParameter("planilha" + i));
        i++;
    }
    return planilhas;
}

//funcao para pegar da planilha de índice que veio na url
function getIndice() {
    return getUrlParameter("indice");
}

function carregarPlanilhasNaTabela(sheets) {
    sheets.forEach( p => {
        nome = p.split('\\')
        nome = nome[nome.length-1]
        let html = `<tr class="trClass">
            <th scope="row">
                <input class="radioButton" type="radio" name="radio-planilha">
            </th>
            <td>${nome}</td>
            <td>
                <input class="input-renomear-planilha" type="text" name="" id="${p}" disabled="true">
            </td>
            <td><p>Pendente</p></td>
        </tr>`;

        $("#table-planilhas").append(html)


    });
}

//funcao que carrega as colunas de uma planilha na tabela "tabela-colunas"
function carregarColunasNaTabela(colunas, colunas_decodificadas, index) {
    //console.log({colunas,colunas_decodificadas,index})
    if(colunas && colunas_decodificadas) {

        //limpando conteudo da tabela
        $("#table-colunas > tbody > tr").remove();
        
        //pegando intervalo para iterar de no máximo 10 em 10 até o final das colunas
        var x = colunas.length - index
        x = (10 < x) ? 10:x
        
        for (i = 0; i < x; i++) {
            var valorDecodificado = colunas_decodificadas[index + i];
            if(valorDecodificado.length > 50){
                valorDecodificado = valorDecodificado.slice(0,47)
                valorDecodificado += '...'
            }
            let html = `<tr>
                <th scope="row">${index+i+1}</th>
                <td title="${colunas[index + i]}" class="">${colunas[index + i]}</td>
                <td title="${colunas_decodificadas[index + i]}"class="">${valorDecodificado}</td>
                <td>
                <input type="text" disabled="true">
                </td>
                <td class="">
                <button class="check-circle-solid">
                </td>
                </tr>`;
            
            $("#table-colunas").append(html);
        }
        indice_col_atual += x;
    }
}
    
$(document).ready(function() {
    //inicializando arquivo python
    var {
        PythonShell
    } = require("python-shell")
    var path = require("path")

    indice = getIndice(); // pegando planilha de indice vinda da url
    planilhas = getPlanilhas(); //pegando planilhas vindas da url
    
    carregarPlanilhasNaTabela(planilhas)
    
    $('input[name="radio-planilha"]').change(function() {
        planilha_atual = planilhas[$('input[name="radio-planilha"]:checked').closest('tr').index()];
        /*buscarColunasDePlanilha(planilha_atual)
        buscarColunasDecodificadasDePlanilha(planilha_atual, indice)*/
        buscarColunasCodificadas_Decodificadas(planilha_atual,indice);

        let nome = planilha_atual.split('\\');
        nome = nome[nome.length-1]
        $("#planilha-selecionada").html('');
        $("#planilha-selecionada").html('Planilha Selecionada: ' + nome);
        
        if($("#div-botao").is(":hidden")) {
            $("#div-botao").show();
        }
        return false;
    });
    
    $("#botao-colunas").click(function(){
        if(indice_col_atual == colunas_planilha_atual.length) {
            //document.getElementById(planilha_atual).disabled = false;
            
            var input = document.getElementById(planilha_atual);
            input.disabled = false
            //console.log(input);
            //var texto = $(this).closest("td").next().find("p");
            //console.log(texto);
        }else {
            carregarColunasNaTabela(colunas_planilha_atual, colunas_decodificadas_planilha_atual, indice_col_atual);
        }
        
    });


    $("#table-colunas").on("click", ".check-circle-solid", function () {
        $(this).toggleClass("bc-green")
        var input = $(this).closest("td").prev().find("input")
        input.prop('disabled', function(i, v) { return !v; });
        input.val('')
    })

    

});