const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PythonShell } = require("python-shell");
const pool = require("../Db/db");
const uploadFile = require("../dr");
let eXtname = ".webm";
async function addclass(req, res) {
  res.render("index");
}
async function adding(req, res) {
  let { video, audio, subject, chepter, slideurl } = req.body;

  let classnumber = await pool(`select count(*) as count from class where chepter='${chepter}'`);
  sendlog(req, "requst accepted start process");

  classnumber = classnumber[0].count;
  console.log(classnumber);
  sendlog(req, "Start Downloading video file" + path.basename(video));

  let videores = await downloadfile(video, "v" + eXtname, req);
  if (videores) {
    sendlog(
      req,
      "Start Downloading audio file" +
        path.basename(audio) 
    );
    let audiores = await downloadfile(audio, "a" + eXtname, req);
    if (audiores) {
      sendlog(
        req,
        "Donwload finishied now run python script for compressed video"
      );

      //run python
      let pyresponse = await runpython(req, res, video, audio);
      if (pyresponse) {
        try {
          sendlog(req, "Start uploading on google drive");
          let uploadResponse = await uploadFile(path.basename(video), subject,classnumber+1,chepter);
          if (uploadResponse.status) {
            sendlog(req, "succuess fully uploaded on google drive");
            sendlog(req, "inseert on database");
            let sql = `INSERT INTO class (subject, class ,slide ,video,chepter) VALUES ('${subject}',${classnumber+1}, '${slideurl}','${
              uploadResponse.id
            }','${chepter}')`;
            await pool(sql);
            sendlog(req, "inseert complete on database");
            sendlog(req, "clear demp files");
            fs.unlink("./temp/v" + eXtname, (err) => {
              if (err != null) sendlog(req, " error at clear demp files");
            });
            fs.unlink("./temp/a" + eXtname, (err) => {
              if (err != null) sendlog(req, " error at clear demp files");
            });
            fs.unlink("./temp/output.mp4", (err) => {
              if (err != null) sendlog(req, " error at clear demp files");
            });

            sendlog(req, "dump clearing complete complete");
            sendlog(req, "process complete");
            res.json({ code: 200, msg: "process complete" });
          } else {
            sendlog(req, "error at file uploading");
            sendlog(req, uploadResponse.error);
            sendlog(req, "process stoped");
            res.json({ code: 400, msg: "failed" });
          }
        } catch (error) {
          throw error;
        }
      }
    } else {
      sendlog(req, "process stoped");
      res.json({ code: 400, msg: "failed" });
    }
  } else {
    sendlog(req, "process stoped");
    res.json({ code: 400, msg: "failed" });
  }
}
function sendlog(req, msg) {
  req.io.emit("updafte", msg);
}

function runpython(req, res, video, audio) {
  let videopath = path.resolve(__dirname, "../temp", "v" + eXtname);
  let audiopath = path.resolve(__dirname, "../temp", "a" + eXtname);
  let options = {
    scriptPath: path.resolve(__dirname, "../", ""),
    args: [videopath, audiopath],
  };
  return new Promise((resolve, reject) => {
    PythonShell.run("main.py", options, function (err, respy) {
      if (err) {
        console.log(err);
        sendlog(req, err);
        sendlog(
          req,
          toString("problem while compres video audio in python file")
        );

        sendlog(req, "process stoped");
        res.json({ code: 400, msg: "failed" });
        reject(false);
        //reject(false);
      }
      if (respy) {
        respy.forEach((x) => {
          sendlog(req, x);
        });
        resolve(true);
      }
    });
  });
}
async function downloadfile(url, filename, req) {
  try {
    let name = path.basename(url);

    let video = path.resolve(__dirname, "../temp", filename);
    let resposnse = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    resposnse.data.pipe(fs.createWriteStream(video));
    return new Promise((res, err) => {
      resposnse.data.on("end", () => {
        sendlog(req, filename + " downloaded successfully");
        res(true);
      });
      resposnse.data.on("error", (er) => {
        sendlog(req, filename + " downloaded error " + er);

        err(er);
      });
    });
  } catch (error) {
    sendlog(req, filename + " downloaded error " + error);
  }
}

module.exports = { addclass, adding };
