//funcao para verificar se um item "li" já existe na lista-planilhas
var check = function(li) {
    return $("#lista-planilhas li").filter(function(i, li2) {
        let aux = $(li2).text()
        aux = aux.replace("remover", "").trim()

        return aux == li;
    }).length > 0;
};

//funcao para pegar caminho do python
var caminhoDoPython = ''

cmd = require('node-cmd')
cmd.get(
    'where python',
    function(err, data, stderr) {
        pythonPath = (data.split('\n')[0])
    }
);

//funcao para realizar algum processamento em python e retornar ao JS
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
    var python = new PythonShell('diretorios.py', opcoes);

    var response;
    //quando o arquivo python retornar algo esse evento será disparado
    python.on('message', function(data) {
        if (JSON.parse(data)) {
            response = JSON.parse(data)
            if (response) {
                if (response.opcao == 1) {

                    response.arquivos.forEach(element => {
                        let aux_arquivo = element.split("\\")
                        $("#selectIndice").append(`<option value="${element}" title="${element}">${aux_arquivo[aux_arquivo.length -1]}</option>`)
                    });
                }
            }
        }
    })
}

function buscarIndicesNoDiretorio(dir) {
    var path = require("path")
    var json = {
        "opcao": 1,
        "diretorio": path.join(__dirname, dir)
    }
    sendRequest(json)
}

$(document).ready(function() {

    buscarIndicesNoDiretorio("../_assets/_csv/indices_gerais")

    //evento de remover um item da lista
    $("#div-planilhas").on("click", ".remover-planilha", function() {
        let li = $(this).closest("li")
        li.remove()

        if ($('#lista-planilhas li').length == 0) $("#div-planilhas").hide()

    });

    //evento quando uma ou varias planilhas São selecionadas no input
    $('.input-file-planilhas').change(function(e) {

        $("#div-planilhas").show()

        var fileName = ' '

        size = e.target.files.length
        size--

        for (i = 0; i <= size; i++) {
            fileName = e.target.files[i].path

            if (!check(fileName))
                $("#lista-planilhas").append(`<li class="list-group-item"><span>${fileName}</span> <button type="button" class="remover-planilha" style="float:right">remover</button> </li>`)
            else
                alert(`A planilha "${fileName}" já foi escolhida!`)
        }

        //$('.custom-file-planilha').html(fileName);
    });

    $('.input-file-indice').change(function(e) {
        fileName = e.target.files[0].name

        $('.custom-file-indice').html(fileName)

    })

    //evento antes de submeter o form para outra página
    $("#form").submit(function(e) {
        var planilhas = [];
        $('#lista-planilhas span').each(function() {
            planilhas.push($(this).text());
        });

        var indice = $('#selectIndice').val()

        planilhas.forEach((p, i) => {
            $("#form").append('<input type="hidden" name="planilha' + i + '" value="' + p + '">')
        })
        $("#form").append('<input type="hidden" name="indice" value="' + indice + '">')
    })
})