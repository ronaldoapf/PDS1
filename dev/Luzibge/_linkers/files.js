function getFiles(){
    var {PythonShell} = require("python-shell")
    var path = require("path")
    
    var planilhas = [];

    var planilhasCSV = $('#planilhasCSV').prop("files")
    planilhas = $.map(planilhasCSV, function(val) { return val.path; });
    
    var indiceCSV =   $('#indiceCSV').prop("files")
    var indice = $.map(indiceCSV, function(val) { return val.path; });
    
    // Criação do JSON
    json = {
        "planilhas": planilhas,
        "indice": indice
    }
    
    console.log(json)
    
    var opcoes = {
        scriptPath : path.join(__dirname, '../_engine/'),
        args : [planilhas, indice]
    }

    var file = new PythonShell('teste-global.py', opcoes);
    console.log(file)

    file.on('message', function(message) {
        swal(message);
    })
}


  