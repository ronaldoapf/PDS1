function getFiles(){
    var {PythonShell} = require("python-shell")
    var path = require("path")
    
    var planilhas = [];

    var planilhasCSV = $('#planilhasCSV').prop("files")
    var planilhas = $.map(planilhasCSV, function(val) { return val.path; });

    var indiceCSV =   $('#indiceCSV').prop("files")
    var indice = $.map(indiceCSV, function(val) { return val.path; });
    
    // Criação do JSON
    // json = {
    //     "opcao": 1,
    //     "planilhas": JSON.stringify(planilhas),
    //     "indice": indice
    // }
    
    var opcoes = {
        mode: "text",
        encoding: "utf8",
        pythonOptions: ["-u"],
        scriptPath : path.join(__dirname, '../_engine/'),
        args : [1,planilhas, indice],
        pythonPath: 'C:/Python27/python'
    }

    var file = new PythonShell('teste-global.py', opcoes);
    

    file.on('message', function(message) {
        console.log(message);
    })
}


  