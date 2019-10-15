function getFiles(){
    var {PythonShell} = require("python-shell")
    var path = require("path")
    
    var planilhasCSV = $('#planilhasCSV').prop("files")
    var planilhas = $.map(planilhasCSV, function(val) { return val.path; });
    
    var indiceCSV =   $('#indiceCSV').prop("files")
    var indice = $.map(indiceCSV, function(val) { return val.path; });
    
    // Criação do JSON
    json = {
        "opcao": 1,
        "planilhas": planilhas,
        "indice": indice
    }
    
    console.log(json)
    
    var opcoes = {
        scriptPath : path.join(__dirname, '../_engine/'),
        args : [json]
    }

    var file = new PythonShell('teste-global.py', opcoes);
    console.log(file)
    
    file.send(json);

    file.on('message', function(message) {
        swal(message);
    })
}


  