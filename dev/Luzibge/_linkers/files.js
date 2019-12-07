//funcao para verificar se um item "li" já existe na lista-planilhas
var check = function(li) {
    return $("#lista-planilhas li").filter(function(i, li2) {
        let aux = $(li2).text()
        aux = aux.replace("remover", "").trim()

        return aux == li;
    }).length > 0;
};

$(document).ready(function() {

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
    $("#form").submit(function() {

        var planilhas = [];
        $('#lista-planilhas span').each(function() {
            planilhas.push($(this).text());
        });

        var indiceCSV = $('#indiceCSV').prop("files")
        var indice = $.map(indiceCSV, function(val) { return val.path; });

        planilhas.forEach((p, i) => {
            $("#form").append('<input type="hidden" name="planilha' + i + '" value="' + p + '">')
        })
        indice.forEach(i => {
            $("#form").append('<input type="hidden" name="indice" value="' + i + '">')
        })
    })
})