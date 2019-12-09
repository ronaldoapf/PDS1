import os
import sys
import json

def processarRequest(request):
    if request["opcao"] == 1:
        path = request["diretorio"]
        files = []
        # r=root, d=directories, f = files
        for r, d, f in os.walk(path):
            for file in f:
                if '.csv' in file:
                    files.append(os.path.join(r, file))

        response = {
            "opcao": 1,
            "arquivos": files
        }
        print (json.dumps( response ))

if __name__ == "__main__":
    if sys.argv[1]:
        x = sys.argv[1]
        x = json.loads(x)

        processarRequest(x)
        sys.stdout.flush()