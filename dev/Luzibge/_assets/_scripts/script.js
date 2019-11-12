//variaveis globais
var url_indice; // par para pegar a planilha de indice vinda da url
var url_planilhas; //var para pegar as planilhas vindas da url

//Este objeto tem como proposito armazenar informaçÕes sobre a planilha que está sendo processada (passando de 10 em 10 entre suas colunas)
var planilha_atual = { 
    diretorio : "",
    indice : 0, // quantidade de colunas passadas de 10 em 10
    colunas : [],
    colunas_decodificadas : []
};

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
            response = JSON.parse(data)  
            if (response) {
                if (response.opcao == 1) {
                    planilha_atual.colunas = response.colunas;
                }
                if(response.opcao == 2) {
                    planilha_atual.colunas_decodificadas = response.colunas_decodificadas;
                }
                if(response.opcao == 3) {
                    planilha_atual.indice = 0;
                    planilha_atual.colunas = response.colunas
                    planilha_atual.colunas_decodificadas = response.colunas_decodificadas
                    
                    if(planilha_atual.colunas && planilha_atual.colunas_decodificadas) {
                        carregarColunasNaTabela(planilha_atual.colunas, planilha_atual.colunas_decodificadas, planilha_atual.indice);
                    }
                }
            }
            else {
                alert("Erro ao carregar planilha!");
            }
        }
    })
}

function buscarColunasCodificadas_Decodificadas(dir_planilha, dir_indice) {
    var json = {
        "opcao": 3,
        "dir_planilha": dir_planilha,
        "dir_indice": dir_indice
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
        let html = `<tr>
            <th scope="row">
                <input type="radio" name="radio-planilha">
            </th>
            <td>${nome}</td>
            <td>
                <input type="text" name="" id="" disabled="true">
            </td>
            <td>Pendente</td>
        </tr>`;

        $("#table-planilhas").append(html)
    });
}

//funcao que carrega as colunas de uma planilha na tabela "tabela-colunas"
function carregarColunasNaTabela(colunas, colunas_decodificadas, index) {
<<<<<<< HEAD
    //console.log({colunas,colunas_decodificadas,index})
=======
    
>>>>>>> 78291a7fea3cd41662e720f8278d261126bc8084
    if(colunas && colunas_decodificadas) {

        //limpando conteudo da tabela
        $("#table-colunas > tbody > tr").remove();
        
        //pegando intervalo para iterar de no máximo 10 em 10 até o final das colunas
        var x = colunas.length - index;
        x = (10 < x) ? 10:x
        
        for (i = 0; i < x; i++) {
            let html = `<tr>
            <th scope="row">${index+i+1}</th>
            <td class="">${colunas[index + i]}</td>
            <td class="">${colunas_decodificadas[index + i]}</td>
            <td>
            <input type="text" disabled="true">
            </td>
            <td class="">
            <button class="check-circle-solid">
            </td>
            </tr>`;
            
            $("#table-colunas").append(html);
        }
        planilha_atual.indice += x;
    }
}
    
$(document).ready(function() {
    //inicializando arquivo python
    var {
        PythonShell
    } = require("python-shell")
    var path = require("path")

    url_indice = getIndice(); // pegando planilha de indice vinda da url
    url_planilhas = getPlanilhas(); //pegando planilhas vindas da url
    
    carregarPlanilhasNaTabela(url_planilhas)
    
    $('input[name="radio-planilha"]').change(function() {
        planilha_atual.diretorio = url_planilhas[$('input[name="radio-planilha"]:checked').closest('tr').index()];
        

        buscarColunasCodificadas_Decodificadas(planilha_atual.diretorio,url_indice);

        let nome = planilha_atual.diretorio.split('\\');
        nome = nome[nome.length-1]
        $("#planilha-selecionada").html('');
        $("#planilha-selecionada").html('Planilha Selecionada: ' + nome);
        
        if($("#div-botao").is(":hidden")) {
            $("#div-botao").show();
        }
        return false;
    });
    
<<<<<<< HEAD
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

=======
    $("#div-botao").click(function(){
        carregarColunasNaTabela(planilha_atual.colunas, planilha_atual.colunas_decodificadas, planilha_atual.indice);
    });
>>>>>>> 78291a7fea3cd41662e720f8278d261126bc8084

    $("#table-colunas").on("click", ".check-circle-solid", function () {
        $(this).toggleClass("bc-green")
        var input = $(this).closest("td").prev().find("input")
        input.prop('disabled', function(i, v) { return !v; });
        input.val('')
    })

});