const { spawn, exec } = require("child_process"); //for running and executing script.
const fs = require("fs/promises");
const runCode = (language, fileName, inputs) => {
  let errors = [];
  let output = [];
  fs.writeFile("input.txt", inputs);
  switch (language) {
    case "python": {
      const python = spawn("python3", [fileName], { detached: true });
      python.on("error", (err) => {
        errors.push(err.toString());
      });
      python.stderr.on("data", function (err) {
        errors.push(err.toString());
      });
      python.stdout.on("data", function (data) {
        output = data.toString();
        console.log(output);
      });

      python.on("close", (data) => {
        console.log(errors);
      });

      break;
    }

    case "c":
    case "cpp": {
      const executableFileName = fileName.split(".")[0];
      var args = [fileName, "-o", executableFileName];
      const cpp = spawn("g++", args, { detached: true });
      cpp.stderr.on("data", function (data) {
        errors.push(data.toString());
      });
      cpp.on("close", () => {
        exec(`./${executableFileName}`, (error, stdout, stderr) => {
          if (error) errors.push(error.toString());
          if (stderr) errors.push(stderr.toString());
          if (errors.length) console.log(errors);
          if (stdout) console.log(stdout);
        });
      });
      break;
    }
  }
};

//We have to add input values with spaces.
// run python code
runCode("python", "demo.py", "Sanjit");
// run c/cpp code
runCode("cpp", "demo.cpp", "23");
