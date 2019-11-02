function getFiles(){
    var {PythonShell} = require("python-shell")
    var path = require("path")
    
    var planilhas = [];

    var planilhasCSV = $('#planilhasCSV').prop("files")
<<<<<<< HEAD
    var planilhas = $.map(planilhasCSV, function(val) { return val.path; });
    console.log(planilhas)

=======
    planilhas = $.map(planilhasCSV, function(val) { return val.path; });
    
>>>>>>> a4e810738bb18b6cea368ac2d899103238a6fc67
    var indiceCSV =   $('#indiceCSV').prop("files")
    var indice = $.map(indiceCSV, function(val) { return val.path; });
    
    // Criação do JSON
    json = {
<<<<<<< HEAD
        "opcao": 1,
        "planilhas": JSON.stringify(planilhas),
=======
        "planilhas": planilhas,
>>>>>>> a4e810738bb18b6cea368ac2d899103238a6fc67
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


  