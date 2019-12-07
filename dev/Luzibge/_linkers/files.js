$(document).ready(function() {
    $("#form").submit(function() {
        var planilhasCSV = $('#planilhasCSV').prop("files")
        var planilhas = $.map(planilhasCSV, function(val) { return val.path; });

        var indiceCSV = $('#indiceCSV').prop("files")
        var indice = $.map(indiceCSV, function(val) { return val.path; });

        planilhas.forEach((p, i) => {
            console.log(p)
            $("#form").append('<input type="hidden" name="planilha' + i + '" value="' + p + '">')
        })
        indice.forEach(i => {
            console.log(i)
            $("#form").append('<input type="hidden" name="indice" value="' + i + '">')
        })

        //return false;
    })
})