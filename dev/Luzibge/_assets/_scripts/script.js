//variaveis globais
var buttons; //variavel para controlar os botoes da coluna selecionada para ficar habilitado/desabilitado se houver coluna selecionada da planilha
var planilhas = [];
var planilha_atual;
var url_indice; // par para pegar a planilha de indice vinda da url
var url_planilhas; //var para pegar as planilhas vindas da url
var arrayIndice = []; //array para percorrer indice

//funcao para pegar caminho do python
var caminhoDoPython = ''

cmd = require('node-cmd')
cmd.get(
    'where python',
    function(err, data, stderr) {
        pythonPath = (data.split('\n')[0])
    }
);

function sendRequest(json) {
    pythonPath = ''


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
        pythonPath: caminhoDoPython
    }
    var python = new PythonShell('planilhas.py', opcoes);

    var response;
    //quando o arquivo python retornar algo esse evento será disparado
    python.on('message', function(data) {
        if (JSON.parse(data)) {
            response = JSON.parse(data)
            if (response) {
                if (response.opcao == 1) {
                    planilhas[planilha_atual] = new Planilha(url_planilhas[planilha_atual], 0, response.colunas, response.colunas_decodificadas, {})
                    if (planilhas[planilha_atual].colunas && planilhas[planilha_atual].colunas_decodificadas) {
                        let aux_lenght = (planilhas[planilha_atual].colunas.length > 10) ? 10 : planilhas[planilha_atual].colunas.length
                        planilhas[planilha_atual].indice = aux_lenght
                        carregarColunasNaTabela(inicilizarArray(0, aux_lenght));
                    }
                } else if (response.opcao == 2) {
                    if (response.res) alert(`Planilha salva no diretório: "${response.dir_salvar}"`)
                }
            } else {
                alert("Erro ao se comunicar com Python, verifique página de tutoriais!");
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

        let html = `<tr class="trClass cursor-default">
            <th scope="row">
                ${i+1}
            </th>
            <td class="cursor-pointer" onmouseover="style='text-decoration:underline;'" onmouseout="style='text-decoration:none;'">
            <p class="nome-planilha">${nome}</p></td>
            <td>
                <input class="input-renomear-planilha" type="text" name="" id="${p}" style="width: 80%;" disabled="true">
            </td>
            <td > 
                <button title="Desfazer ações" class="btn btn-light desfazerAcoes confirmar-hidden" disabled hidden>
                    Confirmar Ação
                </button>
                <button title="Desfazer ações" class="btn btn-light desfazerAcoes" disabled>
                    <img src="../_assets/icon/icons8-undefined-26.png" alt="Ícone para desfazer ações"></img>
                </button>
                
                <button title="Editar nome da planilha" class="btn btn-light editarPlanilha" disabled>
                    <img src="../_assets/icon/icons8-informações-26.png"></img>
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
    //limpando conteudo da tabela
    $("#table-colunas > tbody > tr").remove();

    arr.forEach(function(col) {
        var coluna = planilhas[planilha_atual].colunas[col]
        var coluna_decodificada = planilhas[planilha_atual].colunas_decodificadas[col]



        var valorDecodificado = coluna_decodificada;

        if (valorDecodificado.length > 50) {

            let i_slice = (valorDecodificado.indexOf(" ") != -1) ? valorDecodificado.indexOf(" ") : valorDecodificado.indexOf("_")
            let temp = valorDecodificado.slice(0, i_slice)
            temp += ' ... '
            temp += valorDecodificado.slice(valorDecodificado.length - (50 - temp.length), valorDecodificado.length)
            valorDecodificado = temp
        }

        let aux = ""
        let valor = ""
        let disabled = "disabled"
        if (verificarColunaNaTabela(col, planilhas[planilha_atual].colunas_selecionadas) == 1) {
            aux = "bc-green"
            valor = planilhas[planilha_atual].colunas_selecionadas[col]
            disabled = ""
        }

        let html = `<tr>
            <th scope="row" class="cursor-default"><p>${col+1}</p></th>
            <td title="${coluna}" class="cursor-default">${coluna}</td>
            <td title="${coluna_decodificada}"class="cursor-default">${valorDecodificado}</td>
            <td> <input type="text" ${disabled} value="${valor}"> </td>
            <td class=""> <button class="check-circle-solid ${aux}"> </td>
            </tr>`;


        $("#table-colunas").append(html);
    })
}

//Função para fazer o controle de só habilitar botão de salvar e restaurar quando tiver alguma coluna selecionada na planilha
function controleBotoes() {

    if (Object.keys(planilhas[planilha_atual].colunas_selecionadas).length > 0) {
        buttons.prop("disabled", false);
    } else {
        buttons.prop("disabled", true);
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

    $('#table-planilhas').on('click', '.nome-planilha', function() {

        if (!$("#div-colunas").is(":visible")) $("#div-colunas").show();


        if (buttons) {
            buttons.prop("disabled", true)
        }

        let tr = $(this).closest("tr");
        planilha_atual = tr.index()

        buscarColunasCodificadas_Decodificadas(url_planilhas[planilha_atual], url_indice);

        buttons = $(this).closest("tr").find("button");
        if (planilhas[planilha_atual]) {
            controleBotoes();
        }

        var selected = tr.hasClass("bg-gray");
        $("#table-planilhas tr").removeClass("bg-gray");

        if (!selected)
            $(this).closest("tr").addClass("bg-gray");

        let nome = url_planilhas[planilha_atual].split('\\');
        nome = nome[nome.length - 1]

        $("#input-busca").toggle(true)
        $("#planilha-selecionada").html('');
        $("#planilha-selecionada").html('Filtrar colunas da planilha "' + nome + '":' + '<i class="material-icons" style="cursor: pointer;" data-toggle="modal" data-target="#ModalLongoColunasPlanilha">info</i>');
        if ($("#div-botao").is(":hidden")) {
            $("#div-botao").show();
        }

        return false;


    });

    //botão próximo
    $("#botao-colunas").click(function() {
        if(planilhas[planilha_atual].indice != planilhas[planilha_atual].colunas.length) {
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
        let i_coluna = $(this).closest("tr").find('p').text() - 1

        i = (i_atual % 10 == 0) ? i - 10 : i - i_atual % 10

        if ($(this).hasClass("bc-green")) {

            $(this).removeClass("bc-green")
            input.attr('disabled', 'true');
            delete planilhas[planilha_atual].colunas_selecionadas[i_coluna]
            input.val("")
            controleBotoes();
        } else {

            $(this).addClass("bc-green")
            input.removeAttr('disabled');
            let aux = planilhas[planilha_atual].colunas_decodificadas[i_coluna]
            planilhas[planilha_atual].colunas_selecionadas[i_coluna] = planilhas[planilha_atual].colunas_decodificadas[i_coluna]; //salvando o valor padrão da decodificação por precaução

            $(input).blur(function() { //pego o determinado valor que o usuário digitar no campo para renomear
                if ($(this).val().length > 0) {
                    planilhas[planilha_atual].colunas_selecionadas[i_coluna] = $(this).val(); //save valor renomeado que o usuario digitou

                }
            })
            input.val(aux)
            controleBotoes();

        }
    })

    //funçao que pega o valor que o usuário digitou e salva no array planilhas_selecionadas do objeto planilhas
    $("#table-colunas").on("click", "input[type='text']", function() {

        var input = $(this)
        input.select();

        var i_atual = planilhas[planilha_atual].indice
        let i_coluna = $(this).closest("tr").find('p').text() - 1
        let i = $(this).closest("tr").index() + i_atual
        i = (i_atual % 10 == 0) ? i - 10 : i - i_atual % 10

        $(input).blur(function() { //pego o determinado valor que o usuário digitar no campo para renomear

            if ($(this).val().length > 0) {
                planilhas[planilha_atual].colunas_selecionadas[i_coluna] = $(this).val(); //save valor renomeado que o usuario digitou
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

    function teste(obj) {
        let tr = obj.closest("tr")
        let input = obj.closest("tr").find("input")
        planilha_atual = tr.index()

        if (planilhas[planilha_atual]) {

            planilhas[planilha_atual].colunas_selecionadas = {}
            planilhas[planilha_atual].indice = 10
            carregarColunasNaTabela([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
        input.val("")
        input.prop("disabled", true)
        buttons.prop("disabled", true)
    }
    // Função para desfazer ações fazendo com que o vetor de colunas_selecionadas receba nenhum valor
    $(".desfazerAcoes").click(function() {
        let p = $(this).closest("tr").find("p")

        $.confirm({
            title: 'Confirmar Ação',
            columnClass: 'col-md-6',
            content: `Deseja desfazer todo o processamento realizado na planilha "${p.text()}" ?`,
            buttons: {
                Cancelar: {
                    btnClass: 'btn-red',
                },
                Confirmar: {
                    btnClass: 'btn-blue',
                    action: function() {
                        teste(p);
                    }
                }
            }

        })
    })

    $("#input-busca").on('input', function() {
        entrada = $(this).val().toLowerCase(); // variavel que pega o valor que o usuário está digitando
        if (entrada) {

            let relacao = planilhas[planilha_atual].getRelation()

            var valores = $.map(relacao, function(key, value) {
                return value;
            })
            var filtered = valores.filter(function(str) { return str.indexOf(entrada) === 0; });
            var arr = [];
            filtered.forEach(p => {
                arr.push(relacao[p])
            })

            var arr_SemRepeticao = [];
            $.each(arr, function(i, el) {
                if ($.inArray(el, arr_SemRepeticao) === -1) arr_SemRepeticao.push(el);
            })

            carregarColunasNaTabela(arr_SemRepeticao)
        } else {

            var i_atual = planilhas[planilha_atual].indice
            var i = (i_atual % 10 == 0) ? i_atual - 10 : i_atual - (i_atual % 10)

            var arr = inicilizarArray(i, planilhas[planilha_atual].indice)
            carregarColunasNaTabela(arr)
        }
    });

});