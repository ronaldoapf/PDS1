//variaveis globais
var url_indice; // par para pegar a planilha de indice vinda da url
var url_planilhas; //var para pegar as planilhas vindas da url

//Este objeto tem como proposito armazenar informaçÕes sobre a planilha que está sendo processada (passando de 10 em 10 entre suas colunas)
var planilha_atual = { 
    diretorio : "",
    indice : 0, // quantidade de colunas passadas de 10 em 10
    colunas : [],
    colunas_decodificadas : [],
    colunas_selecionadas : {}
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
        let html = `<tr class="trClass">
            <th scope="row">
                <input class="radioButton" type="radio" name="radio-planilha" hidden>
            </th>
            <td onmouseover="style='text-decoration:underline;'" onmouseout="style='text-decoration:none;'">${nome}</td>
            <td>
                <input class="input-renomear-planilha" type="text" name="" id="${p}" disabled="true">
            </td>
            <td><p>Pendente</p></td>
        </tr>`;

        $("#table-planilhas").append(html)


    });
}

//função que verifica se a coluna já foi marcada
function verificarColunaNaTabela(index,colunas_selecionadas){
    console.log("index chegado:" + index)
    var lista = Object.keys(colunas_selecionadas)
    console.log(lista)
    var flag=0;
    for (j=0; j < lista.length; j++){
        if(index == lista[j]){
            flag=1;
        }
    }
    return flag;
}

//funcao que carrega as colunas de uma planilha na tabela "tabela-colunas"
function carregarColunasNaTabela(colunas, colunas_decodificadas, index) {
    if(colunas && colunas_decodificadas) {

        //limpando conteudo da tabela
        $("#table-colunas > tbody > tr").remove();
        
        //pegando intervalo para iterar de no máximo 10 em 10 até o final das colunas
        var x = colunas.length - index;
        x = (10 < x) ? 10:x
        
        for (i = 0; i < x; i++) {
            var valorDecodificado = colunas_decodificadas[index + i];
            if(valorDecodificado.length > 50){
                valorDecodificado = valorDecodificado.slice(0,47)
                valorDecodificado += '...'
            }
            let aux = ""
            let valor = ""
            let disabled = "disabled=true"
            if(verificarColunaNaTabela(index+i,planilha_atual.colunas_selecionadas) == 1) {
                aux = "bc-green"
                valor = planilha_atual.colunas_selecionadas[index+i]
                disabled = ""
            }
            
            let html = `<tr>
                <th scope="row">${index+i+1}</th>
                <td title="${colunas[index + i]}" class="">${colunas[index + i]}</td>
                <td title="${colunas_decodificadas[index + i]}"class="">${valorDecodificado}</td>
                <td>
                <input type="text" ${disabled} value="${valor}">
                </td>
                <td class="">
                <button class="check-circle-solid ${aux}">
                </td>
                </tr>`;
                
            
            $("#table-colunas").append(html);
        }
            planilha_atual.indice += x;
    }
}
    
$(document).ready(function() {
    $("#input-busca").hide()
    //inicializando arquivo python
    var {
        PythonShell
    } = require("python-shell")
    var path = require("path")

    url_indice = getIndice(); // pegando planilha de indice vinda da url
    url_planilhas = getPlanilhas(); //pegando planilhas vindas da url
    
    carregarPlanilhasNaTabela(url_planilhas)
    
    $('#table-planilhas').on('click', 'tr', function() {

        planilha_atual.diretorio = url_planilhas[$(this).index()];
        //input[name="radio-planilha"],

        buscarColunasCodificadas_Decodificadas(planilha_atual.diretorio,url_indice);
        
        var selected = $(this).hasClass("bg-gray");
        $("#table-planilhas tr").removeClass("bg-gray");
        if(!selected)
                $(this).addClass("bg-gray");
        
        let nome = planilha_atual.diretorio.split('\\');
        nome = nome[nome.length-1]
        $("#input-busca").toggle(true)
        $("#planilha-selecionada").html('');
        $("#planilha-selecionada").html('Filtrar colunas da planilha "'+nome + '":');
        
        if($("#div-botao").is(":hidden")) {
            $("#div-botao").show();
        }
        return false;
    });
    
    //botão próximo
    $("#botao-colunas").click(function(){
        if(planilha_atual.indice == planilha_atual.colunas.length) {
            var input = document.getElementById(planilha_atual.diretorio);
            input.disabled = false
            
        }else {
            carregarColunasNaTabela(planilha_atual.colunas, planilha_atual.colunas_decodificadas, planilha_atual.indice);
            console.log(planilha_atual.colunas_selecionadas)
        }
        
    });
    
    //botao voltar 
    $("#botao-colunasRetornar").click(function(){
        
        
        if(planilha_atual.indice%10 != 0) {
            console.log("entrou")
            planilha_atual.indice = planilha_atual.indice - 10 - (planilha_atual.indice%10)
            carregarColunasNaTabela(planilha_atual.colunas, planilha_atual.colunas_decodificadas, planilha_atual.indice);
        }
        
        else if(planilha_atual.indice - 10 > 0) {
            console.log(planilha_atual.indice)
            console.log(planilha_atual.indice - 10)
            console.log(planilha_atual.indice - 20)
            planilha_atual.indice-=20
            carregarColunasNaTabela(planilha_atual.colunas, planilha_atual.colunas_decodificadas, planilha_atual.indice);
            
        }
    });

    $("#table-colunas").on("click", ".check-circle-solid", function () {
        $(this).toggleClass("bc-green")
        var input = $(this).closest("td").prev().find("input")
        input.prop('disabled', function(i, v) { return !v; });
        
        let i = $(this).closest("tr").index()
        
        planilha_atual.colunas_selecionadas[i + planilha_atual.indice - 10] = planilha_atual.colunas_decodificadas[i + planilha_atual.indice - 10]; //salvando o valor padrão da decodificação por precaução
        
        let aux = planilha_atual.colunas_decodificadas[i + planilha_atual.indice - 10]
        $("input").blur(function () { //pego o determinado valor que o usuário digitar no campo para renomear
            
            if($(this).val().length > 0) {
                planilha_atual.colunas_selecionadas[i + planilha_atual.indice - 10] = $(this).val(); //save valor renomeado que o usuario digitou
            }
        })
        input.val(aux)
    })
});