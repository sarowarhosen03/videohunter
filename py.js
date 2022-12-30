const { PythonShell } = require("python-shell");
const path = require('path');

let options = {
  scriptPath:  path.resolve(__dirname, "", "") ,
args: []
}

PythonShell.run('main.py', options, function (err,res) {
if (err) throw err;
if(res)console.log(res);
});
