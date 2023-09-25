from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/deploy', methods=['POST'])
def deploy():
    code = request.json.get('code')
    project_name = request.json.get('projectName')

    project_name_underscore = project_name.replace(" ", "_")

    dfxJson = """
    {
        "canisters": {
            \"""" + project_name_underscore + """\": {
                "type": "custom",
                "build": "python -m kybra """ + project_name_underscore + """ src/main.py src/main.did",
                "candid": "src/main.did",
                "wasm": ".kybra/""" + project_name_underscore + """/""" + project_name_underscore + """.wasm.gz",
                "declarations": {
                    "output": "test/dfx_generated/""" + project_name_underscore + """"
                }
            }
        }
    }
    """

    if not os.path.isdir(f"data/{project_name_underscore}"):
        # Make all dirs
        os.system(f"mkdir data/{project_name_underscore} && mkdir data/{project_name_underscore}/src")
        # Touch all files  
        os.system(f"touch data/{project_name_underscore}/src/main.py && touch data/{project_name_underscore}/dfx.json")

        dfxFile = open(f"data/{project_name_underscore}/dfx.json", "w")
        dfxFile.write(dfxJson)
        dfxFile.close()

        mainPy = open(f"data/{project_name_underscore}/src/main.py", "w")
        mainPy.write(code)
        mainPy.close()

        os.system(f"cd data/{project_name_underscore} && ~/.pyenv/versions/3.10.2/bin/python -m venv venv && source venv/bin/activate && pip install kybra && dfx deploy {project_name_underscore}")
    else:
        dfxFile = open(f"data/{project_name_underscore}/dfx.json", "w")
        dfxFile.write(dfxJson)
        dfxFile.close()

        mainPy = open(f"data/{project_name_underscore}/src/main.py", "w")
        mainPy.write(code)
        mainPy.close()

        os.system(f"cd data/{project_name_underscore} && source venv/bin/activate && dfx deploy {project_name_underscore}")
    
    os.chdir("./")

    response = {'success': True}

    return jsonify(response)

@app.route('/api/call_method', methods=['POST'])
def call_method():
    project_name = request.json.get('project_name')
    method_name = request.json.get('method')
    args = request.json.get('args')
    project_name_underscore = project_name.replace(" ", "_")
    method_name_underscore = method_name.replace(" ", "_")

    args_values = []
    for arg in args:
        args_values.append(arg["value"])

    args_str = ""
    for val in args_values:
        args_str += f'"{val}" '

    if os.path.isdir(f"data/{project_name_underscore}"):
        out = os.popen(f"cd data/{project_name_underscore} && dfx canister call {project_name_underscore} {method_name_underscore} {args_str}").read()
        response = {'success': True, 'output': out}
        return jsonify(response)
    else:
        response = {'success': False}
        return jsonify(response)

if __name__ == '__main__':
    app.run(port=3000)
