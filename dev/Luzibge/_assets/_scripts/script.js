//variaveis globais
var planilhas  = [];
var planilha_atual = 0
var url_indice; // par para pegar a planilha de indice vinda da url
var url_planilhas; //var para pegar as planilhas vindas da url

/*
//Este objeto tem como proposito armazenar informaçÕes sobre a planilha que está sendo processada (passando de 10 em 10 entre suas colunas)
var planilha_atual = { 
    diretorio : "",
    indice : 0, // quantidade de colunas passadas de 10 em 10
    colunas : [],
    colunas_decodificadas : [],
    colunas_selecionadas : {}
};*/

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
                    console.log("op 1")
                    planilha_atual.colunas = response.colunas;
                }
                if(response.opcao == 2) {
                    console.log("op 2")
                    planilha_atual.colunas_decodificadas = response.colunas_decodificadas;
                }
                if(response.opcao == 3) {
                    planilhas[planilha_atual] = new Planilha(url_planilhas[planilha_atual],0,response.colunas,response.colunas_decodificadas,{})
                    if(planilhas[planilha_atual].colunas && planilhas[planilha_atual].colunas_decodificadas) {
                        console.log("P" +planilhas[planilha_atual].indice)
                        carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);
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
    let aux = planilhas[planilha_atual]
    if(aux) {
        aux.indice = aux.indice - (10 + aux.indice%10)
        carregarColunasNaTabela(aux.colunas, aux.colunas_decodificadas,aux.indice)
    }else{
        var json = {
            "opcao": 3,
            "dir_planilha": dir_planilha,
            "dir_indice": dir_indice
        };
        sendRequest(json)
    }
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
    var lista = Object.keys(colunas_selecionadas)
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
            if(verificarColunaNaTabela(index+i,planilhas[planilha_atual].colunas_selecionadas) == 1) {
                aux = "bc-green"
                valor = planilhas[planilha_atual].colunas_selecionadas[index+i]
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
            planilhas[planilha_atual].indice += x;
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
         
        planilha_atual = $(this).index()
        
        let flag=1
        //verificando se o usuario deseja trocar de planilha, caso ele deseja a flag =1 vai ser ativada e vai trocar a planilha
        /*
        if(planilhas[planilha_atual].diretorio.length >0 && planilhas[planilha_atual].diretorio != url_planilhas[$(this).index()]) {
            flag = 0
            if(confirm("Deseja trocar de planilha?")){
                flag = 1
            }
        }*/
        if(flag==1) {
            //planilha_atual.diretorio = url_planilhas[indice];
            buscarColunasCodificadas_Decodificadas(url_planilhas[planilha_atual],url_indice);
            
            var selected = $(this).hasClass("bg-gray");
            $("#table-planilhas tr").removeClass("bg-gray");
            
            if(!selected)
                $(this).addClass("bg-gray");

            let nome = url_planilhas[planilha_atual].split('\\');
            nome = nome[nome.length-1]
            $("#input-busca").toggle(true)
            $("#planilha-selecionada").html('');
            $("#planilha-selecionada").html('Filtrar colunas da planilha "'+nome + '":');

            if($("#div-botao").is(":hidden")) {
                $("#div-botao").show();
            }
            return false;
        }
        
    });
    
    //botão próximo
    $("#botao-colunas").click(function(){
        console.log(planilhas[planilha_atual].indice)
        if(planilhas[planilha_atual].indice == planilhas[planilha_atual].colunas.length) {
            planilhas[planilha_atual].indice = 0
            var input = document.getElementById(planilhas[planilha_atual].diretorio);
            input.disabled = false        
        }else {
            carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);
            console.log(planilhas[planilha_atual].colunas_selecionadas)
        }
        
    });
    
    //botao voltar 
    $("#botao-colunasRetornar").click(function(){
        
        if(planilhas[planilha_atual].indice%10 != 0) {
            planilhas[planilha_atual].indice = planilhas[planilha_atual].indice - 10 - (planilhas[planilha_atual].indice%10)
            carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);
        }
        
        else if(planilhas[planilha_atual].indice - 10 > 0) {
            planilhas[planilha_atual].indice-=20
            carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);
            
        }
    });

    $("#table-colunas").on("click", ".check-circle-solid", function () {
        var input = $(this).closest("td").prev().find("input")
        let i = $(this).closest("tr").index() + planilhas[planilha_atual].indice - 10
        
        if($(this).hasClass("bc-green")) {
            
            $(this).removeClass("bc-green")
            input.prop('disabled', function(i, v) { return !v; });
            delete planilhas[planilha_atual].colunas_selecionadas[i]
            input.val("")
        
        }else {
            $(this).addClass("bc-green")
            input.prop('disabled', function(i, v) { return !v; });

            planilhas[planilha_atual].colunas_selecionadas[i] = planilhas[planilha_atual].colunas_decodificadas[i]; //salvando o valor padrão da decodificação por precaução
            let aux = planilhas[planilha_atual].colunas_decodificadas[i]
            
            $("input").blur(function () { //pego o determinado valor que o usuário digitar no campo para renomear

                if($(this).val().length > 0) {
                    planilhas[planilha_atual].colunas_selecionadas[i] = $(this).val(); //save valor renomeado que o usuario digitou
                }
            })
            input.val(aux)
        }
    })
});