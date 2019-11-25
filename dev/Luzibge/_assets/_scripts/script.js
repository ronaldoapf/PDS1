//variaveis globais
var planilhas = [];
var planilha_atual;
var url_indice; // par para pegar a planilha de indice vinda da url
var url_planilhas; //var para pegar as planilhas vindas da url

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
        args: [JSON.stringify(json)],
        pythonPath: 'C:\\Users\\Henri\\AppData\\Local\\Programs\\Python\\Python38-32\\python.exe'
    }
    var python = new PythonShell('teste-global.py', opcoes);

    var response;
    //quando o arquivo python retornar algo esse evento será disparado
    python.on('message', function(data) {
        if (JSON.parse(data)) {
            response = JSON.parse(data)
            if (response) {
                if (response.opcao == 1) {
                    planilhas[planilha_atual] = new Planilha(url_planilhas[planilha_atual], 0, response.colunas, response.colunas_decodificadas, {})
                    if (planilhas[planilha_atual].colunas && planilhas[planilha_atual].colunas_decodificadas) {
                        carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);
                    }
                } else if (response.opcao == 2) {
                    if (response.res) alert(`Planilha salva no diretório: "${response.dir_salvar}"`)
                } else {
                    console.log(response)
                }
            } else {
                alert("Erro ao carregar planilha!");
            }
        }
    })
}

function buscarColunasCodificadas_Decodificadas(dir_planilha, dir_indice) {
    let aux = planilhas[planilha_atual]
    if (aux) {
        if (aux.indice >= 10) {
            aux.indice = aux.indice - (10 + aux.indice % 10)
        }
        carregarColunasNaTabela(aux.colunas, aux.colunas_decodificadas, aux.indice)
    } else {
        var json = {
            "opcao": 1,
            "dir_planilha": dir_planilha,
            "dir_indice": dir_indice
        };
        sendRequest(json)
    }
}

function salvarPlanilha(diretorio_salvar, diretorio_planilha, diretorio_indice, colunas_selecionadas) {
    var json = {
        "opcao": 2,
        "dir_salvar": diretorio_salvar,
        "dir_planilha": diretorio_planilha,
        "dir_indice": diretorio_indice,
        "colunas_selecionadas": colunas_selecionadas
    }
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

    sheets.forEach((p, i) => {

        nome = p.split('\\')
        nome = nome[nome.length - 1]

        let html = `<tr class="trClass">
            <th scope="row">
                ${i+1}
            </th>

            <td style="cursor: pointer;" onmouseover="style='text-decoration:underline;'" onmouseout="style='text-decoration:none;'">
            <p class="nome-planilha">${nome}</p></td>
            <td>
                <input class="input-renomear-planilha" type="text" name="" id="${p}" style="width: 80%;" disabled="true">
            </td>
            <td> 
                <button title="Desfazer ações" class="btn btn-light desfazerAcoes" disabled>
                    <img src="../_assets/icon/icons8-undefined-26.png" alt="Ícone para desfazer ações"></img>
                </button>
                
                <button title="Editar nome da planilha" class="btn btn-light editarPlanilha" disabled>
                    <img src="../_assets/icon/icons8-editar-26.png"></img>
                </button>

                <button title="Salvar planilha" class="btn btn-light salvarPlanilha" disabled>
                    <img src="../_assets/icon/icons8-salvar-26.png"></img>
                </button>

            </td>
        </tr>`;

        $("#table-planilhas").append(html)

    });
}

//função que verifica se a coluna já foi marcada
function verificarColunaNaTabela(index, colunas_selecionadas) {
    var lista = Object.keys(colunas_selecionadas)
    var flag = 0;
    for (j = 0; j < lista.length; j++) {
        if (index == lista[j]) {
            flag = 1;
        }
    }
    return flag;
}

//funcao que carrega as colunas de uma planilha na tabela "tabela-colunas"
function carregarColunasNaTabela(colunas, colunas_decodificadas, index) {

    if (colunas && colunas_decodificadas) {

        //limpando conteudo da tabela
        $("#table-colunas > tbody > tr").remove();

        //pegando intervalo para iterar de no máximo 10 em 10 até o final das colunas
        var x = colunas.length - index;
        x = (10 < x) ? 10 : x

        for (i = 0; i < x; i++) {
            var valorDecodificado = colunas_decodificadas[index + i];

            if (valorDecodificado.length > 50) {
                let temp = valorDecodificado.slice(0, valorDecodificado.indexOf("_"))
                temp += '...'
                temp += valorDecodificado.slice(valorDecodificado.length - (50 - temp.length), valorDecodificado.length)
                valorDecodificado = temp
            }
            let aux = ""
            let valor = ""
            let disabled = "disabled=true"
            if (verificarColunaNaTabela(index + i, planilhas[planilha_atual].colunas_selecionadas) == 1) {
                aux = "bc-green"
                valor = planilhas[planilha_atual].colunas_selecionadas[index + i]
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

    $('#table-planilhas').on('click', '.nome-planilha', function() {

        let tr = $(this).closest("tr");
        planilha_atual = tr.index()

        buscarColunasCodificadas_Decodificadas(url_planilhas[planilha_atual], url_indice);

        let buttons = $(this).closest("tr").find("button");
        buttons.prop("disabled", false)


        var selected = tr.hasClass("bg-gray");
        $("#table-planilhas tr").removeClass("bg-gray");

        if (!selected)
            $(this).closest("tr").addClass("bg-gray");

        let nome = url_planilhas[planilha_atual].split('\\');
        nome = nome[nome.length - 1]

        $("#input-busca").toggle(true)
        $("#planilha-selecionada").html('');
        $("#planilha-selecionada").html('Filtrar colunas da planilha "' + nome + '":');

        if ($("#div-botao").is(":hidden")) {
            $("#div-botao").show();
        }
        return false;


    });

    //botão próximo
    $("#botao-colunas").click(function() {

        if (planilhas[planilha_atual].indice == planilhas[planilha_atual].colunas.length) {
            planilhas[planilha_atual].indice = 0
            var input = document.getElementById(planilhas[planilha_atual].diretorio);
            input.disabled = false
        } else {
            carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);
        }

    });

    //botao voltar 
    $("#botao-colunasRetornar").click(function() {

        if (planilhas[planilha_atual].indice % 10 != 0) {
            planilhas[planilha_atual].indice = planilhas[planilha_atual].indice - 10 - (planilhas[planilha_atual].indice % 10)
            carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);
        } else if (planilhas[planilha_atual].indice - 10 > 0) {
            planilhas[planilha_atual].indice -= 20
            carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice);

        }
    });

    //quando um item é marcado como interessante
    $("#table-colunas").on("click", ".check-circle-solid", function() {
        $("input[type='text']").on("click", function() {
            $(this).select();
        });

        var input = $(this).closest("td").prev().find("input")
        let i = $(this).closest("tr").index() + planilhas[planilha_atual].indice - 10

        if ($(this).hasClass("bc-green")) {

            $(this).removeClass("bc-green")
            input.prop('disabled', function(i, v) { return !v; });
            delete planilhas[planilha_atual].colunas_selecionadas[i]
            input.val("")

        } else {

            $(this).addClass("bc-green")
            input.prop('disabled', function(i, v) { return !v; });

            planilhas[planilha_atual].colunas_selecionadas[i] = planilhas[planilha_atual].colunas_decodificadas[i]; //salvando o valor padrão da decodificação por precaução
            let aux = planilhas[planilha_atual].colunas_decodificadas[i]

            $(input).blur(function() { //pego o determinado valor que o usuário digitar no campo para renomear
                if ($(this).val().length > 0) {
                    planilhas[planilha_atual].colunas_selecionadas[i] = $(this).val(); //save valor renomeado que o usuario digitou
                }
            })
            input.val(aux)
        }
    })

    // Função para salvar planilha quando o usuário bem entender necessário
    $(".salvarPlanilha").click(function() {

        input = $(this).closest("tr").find("input")

        if (input.prop("disabled") || input.val() == "Informe o novo nome da planilha") {
            input.prop("disabled", false)
            input.val("Informe o novo nome da planilha")
            input.select()

        } else {
            //pegando nome do arquivo
            let nome = input.val().indexOf(".csv") == -1 ? input.val() + ".csv" : input.val()
            let dir = planilhas[planilha_atual].diretorio;

            dir = dir.substring(0, dir.lastIndexOf("\\") + 1)
            dir += nome

            var response = salvarPlanilha(dir, planilhas[planilha_atual].diretorio, url_indice, planilhas[planilha_atual].colunas_selecionadas)

        }
    })

    // Função para liberar o campo de input para editar planilhas
    $(".editarPlanilha").click(function() {
        let input = $(this).closest("tr").find("input")
        input.prop("disabled", false)
        input.val("Informe o novo nome da planilha")
        input.select()
    })

    // Função para desfazer ações fazendo com que o vetor de colunas_selecionadas receba nenhum valor
    $(".desfazerAcoes").click(function() {
        let p = $(this).closest("tr").find("p")

        if (confirm(`Deseja desfazer todo o processamento realizado na planilha "${p.text()}" ?`)) {
            let tr = $(this).closest("tr")
            let input = $(this).closest("tr").find("input")
            planilha_atual = tr.index()

            if (planilhas[planilha_atual]) {

                planilhas[planilha_atual].colunas_selecionadas = {}
                planilhas[planilha_atual].indice = 0

                carregarColunasNaTabela(planilhas[planilha_atual].colunas, planilhas[planilha_atual].colunas_decodificadas, planilhas[planilha_atual].indice)
            }
            input.val("")
            input.prop("disabled", true)
        }
    })
<<<<<<< HEAD
    
    $("#input-busca").on('input',function(){
=======




    $("#input-busca").on('input', function() {
>>>>>>> 8a778eaaf476f5e900e14f37a121880997ddba2d
        entrada = $(this).val().toLowerCase(); // variavel que pega o valor que o usuário está digitando

        //console.log(planilhas[planilha_atual].getRelation())
        let relacao = planilhas[planilha_atual].getRelation()

        var valores = $.map(relacao, function(key, value) {
            return value;
        })
        var filtered = valores.filter(function(str) { return str.indexOf(entrada) === 0; });

        filtered.forEach(p => {
            console.log(relacao[p])
        })
    })

});