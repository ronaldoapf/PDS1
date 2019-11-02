function getFiles(){
    var {PythonShell} = require("python-shell")
    var path = require("path")
    
    var planilhas = [];

    var planilhasCSV = $('#planilhasCSV').prop("files")
    var planilhas = $.map(planilhasCSV, function(val) { return val.path; });

    var indiceCSV =   $('#indiceCSV').prop("files")
    var indice = $.map(indiceCSV, function(val) { return val.path; });
    
   var json = {
        "opcao": 1,
        "planilhas": planilhas,
        "indice": indice
   };
    
    var opcoes = {
        mode: "text",
        encoding: "utf8",
        pythonOptions: ["-u"],
        scriptPath : path.join(__dirname, '../_engine/'),
        args : JSON.stringify(json),
        pythonPath: 'C:/Users/Henri/AppData/Local/Programs/Python/Python38-32/python.exe'
    }

    var file = new PythonShell('teste-global.py', opcoes);

    file.on('message', function(message) {
        console.log(message);
    })
}


  