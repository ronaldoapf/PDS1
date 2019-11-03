function enviarJsonAoPython(json, python_shell) {
    python_shell.send(json);
}

function buscarColunasDePlanilha(dir_planilha, python_shell) {
    var json = {
        "opcao": 1,
        "dir_planilha": dir_planilha
    };
    enviarJsonAoPython(json);
}

function buscarColunasDecodificadasDePlanilha(dir_planilha, python_shell) {
    var json = {
        "opcao": 3,
        "dir_planilha": dir_planilha
    };
    enviarJsonAoPython(json);
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
        planilhas.push(getUrlParameter(str + i));
        i++;
    }
    return planilhas;
}

//funcao para pegar da planilha de índice que veio na url
function getIndice() {
    return getUrlParameter("indice");
}

//funcao que carrega as colunas de uma planilha na tabela "tabela-colunas"
function carregarColunasNaTabela(colunas, colunas_decodificadas, i_inicio, i_fim) {
    //limpando conteudo da tabela
    $("#tabela-colunas").find("tbody").clear();

    //pegando intervalo para iterar de no máximo 10 em 10 até o final das colunas
    var x = i_fim - i_inciio;

    for (i = 0; i < x; i++) {
        let html = '<tr>' +
            '<td>' +
            colunas[i_inicio + i] +
            '</td>' +

            '<td>' +
            colunas_decodificadas[i_inicio + i] +
            '</td>' +

            '<td>' +
            'COLOCAR AQUI O VALOR DA COLUNA "VALOR RENOMEADO" ' +
            '</td>' +

            '<td>' +
            'COLOCAR AQUI O VALOR DA COLUNA "AÇÕES" ' +
            '</td>' +
            '</tr>';

        $("#tabela-colunas").append(html);
    }
}

$(document).ready(function() {

    //inicializando arquivo python
    var {
        PythonShell
    } = require("python-shell")
    var path = require("path")
    var opcoes = {
        mode: "text",
        encoding: "utf-8",
        pythonOptions: ["-u"],
        scriptPath: path.join(__dirname, '../_engine/'),
        pythonPath: 'C:\\Program Files (x86)\\Python38-32\\python.exe'
    }
    var python = new PythonShell('teste-global.py', opcoes);

    //quando o arquivo python retornar algo esse evento será disparado
    python.on('message', function(data) {
        json = JSON.parse(data)
        console.log(json)
        if (json) {
            if (json["opcao"] == 1) {
                colunas_planilha_atual = json.colunas;
                colunas_decodificadas_planilha_atual = json.colunas_decodificadas;
            }
        }
    })

    var indice = getIndice();
    var planilhas = getPlanilhas(); //pegando planilhas vindas da url
    var planilha_atual = ""; //variavel que armazenara qual planilha esta sendo processada
    var indice_col_atual = 0; //variavel que armazenará o indice de quais colunas que estao sendo processadas da planilha atual
    var colunas_planilha_atual = [];
    var colunas_decodificadas_planilha_atual = [];

    $('#table-planilhas td').click(function() {
        if (planilha_atual === "") {
            planilha_atual = planilhas[$(this).parent('tr').index()];
            console.log(planilha_atual);
        }
        //  else if (indice_col_atual != colunas_planilha_atual.length) {
        //     alert("Ainda falta realizar o processamento de algumas colunas desta planilha!")
        // } 
        else {
            planilha_atual = $(this).parent('tr').index();
            buscarColunasDePlanilha(planilha_atual, python);
            buscarColunasDecodificadasDePlanilha(planilha_atual, python);
        }

    });

    console.log(getPlanilhas("planilhas"));
    console.log(getIndice("indice"));
})