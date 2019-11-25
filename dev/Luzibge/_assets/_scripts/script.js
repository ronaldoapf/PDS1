//variaveis globais
var planilhas = [];
var planilha_atual;
var url_indice; // par para pegar a planilha de indice vinda da url
var url_planilhas; //var para pegar as planilhas vindas da url
var arrayIndice = []; //array para percorrer indice

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
                        planilhas[planilha_atual].indice = 10
                        carregarColunasNaTabela([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
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

function inicilizarArray(n_inicio, n_fim) {
    let arr = []
    for (i = n_inicio; i < n_fim; i++) {
        arr.push(i)
    }
    return arr;
}

function buscarColunasCodificadas_Decodificadas(dir_planilha, dir_indice) {
    let aux = planilhas[planilha_atual]
    let arr = []
    if (aux) {
        if (aux.indice % 10 > 0) {
            arr = inicilizarArray(aux.indice - aux.indice % 10, aux.indice)
        } else
            arr = inicilizarArray(aux.indice - 10, aux.indice)

        carregarColunasNaTabela(arr)
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
//function carregarColunasNaTabela(colunas, colunas_decodificadas, index) {
function carregarColunasNaTabela(arr) {
    console.log(planilhas[planilha_atual].indice)
        //limpando conteudo da tabela
    $("#table-colunas > tbody > tr").remove();

    arr.forEach(function(col) {
        var coluna = planilhas[planilha_atual].colunas[col]
        var coluna_decodificada = planilhas[planilha_atual].colunas_decodificadas[col]



        var valorDecodificado = coluna_decodificada;

        if (valorDecodificado.length > 50) {
            let temp = valorDecodificado.slice(0, valorDecodificado.indexOf("_"))
            temp += '...'
            temp += valorDecodificado.slice(valorDecodificado.length - (50 - temp.length), valorDecodificado.length)
            valorDecodificado = temp
        }

        let aux = ""
        let valor = ""
        let disabled = "disabled=true"
        if (verificarColunaNaTabela(col, planilhas[planilha_atual].colunas_selecionadas) == 1) {
            aux = "bc-green"
            valor = planilhas[planilha_atual].colunas_selecionadas[col]
            disabled = ""
        }

        let html = `<tr>
            <th scope="row">${col+1}</th>
            <td title="${coluna}" class="">${coluna}</td>
            <td title="${coluna_decodificada}"class="">${valorDecodificado}</td>
            <td>
            <input type="text" ${disabled} value="${valor}">
            </td>
            <td class="">
            <button class="check-circle-solid ${aux}">
            </td>
            </tr>`;


        $("#table-colunas").append(html);
    })
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
            $(this).prop("disabled", true)
        } else {
            var i_atual = planilhas[planilha_atual].indice;
            var x = planilhas[planilha_atual].colunas.length - i_atual
            x = (10 < x) ? 10 : x

            var arr = []
            for (i = i_atual; i < i_atual + x; i++)
                arr.push(i)

            planilhas[planilha_atual].indice += x;
            carregarColunasNaTabela(arr)
        }
    });

    //botao voltar 
    $("#botao-colunasRetornar").click(function() {
        var i_atual = planilhas[planilha_atual].indice

        if (i_atual % 10 != 0) {

            planilhas[planilha_atual].indice -= (i_atual % 10)
            arr = inicilizarArray(planilhas[planilha_atual].indice - 10, planilhas[planilha_atual].indice)
            carregarColunasNaTabela(arr);

        } else if (i_atual - 10 > 0) {

            planilhas[planilha_atual].indice -= 10
            arr = inicilizarArray(planilhas[planilha_atual].indice - 10, planilhas[planilha_atual].indice)
            carregarColunasNaTabela(arr);
        }
    });

    //quando um item é marcado como interessante
    $("#table-colunas").on("click", ".check-circle-solid", function() {
        $("input[type='text']").on("click", function() {
            $(this).select();
        });

        var input = $(this).closest("td").prev().find("input")
        var i_atual = planilhas[planilha_atual].indice
        let i = $(this).closest("tr").index() + planilhas[planilha_atual].indice

        i = (i_atual % 10 == 0) ? i - 10 : i - i_atual % 10

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

    //funçao que pega o valor que o usuário digitou e salva no array planilhas_selecionadas do objeto planilhas
    $("#table-colunas").on("click", "input[type='text']", function() {

        var input = $(this)
        input.select();

        var i_atual = planilhas[planilha_atual].indice
        let i = $(this).closest("tr").index() + i_atual
        i = (i_atual % 10 == 0) ? i - 10 : i - i_atual % 10

        $(input).blur(function() { //pego o determinado valor que o usuário digitar no campo para renomear

            if ($(this).val().length > 0) {
                planilhas[planilha_atual].colunas_selecionadas[i] = $(this).val(); //save valor renomeado que o usuario digitou
            }
        })
    });


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
    $("#input-busca").on('input', function() {
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