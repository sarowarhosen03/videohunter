const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

const GOOGLE_API_FOLDER_ID = "1f4s3ZmM4-g07vAP21sA3a173HfR37-2n";
const BIOLOGY = "11k4JhY6YuLkf0TRQjYE_XY0CNoaFqCh1";
const MATH = "1SOdBeixumsSXBqVlV0IFCtMmbI1weWGh";
const PHYSICS = "1cg4ucE5w2BGtl69AZobpVqqlIC2XtVFn";
const CHEMISTRY = "1XuWBXQb3XY0t7kjhxu6AmG_38hPZgZec";

async function uploadFile(filename, subject,classnumber) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./googlekey.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const driveService = google.drive({
      version: "v3",
      auth,
    });
    let folderid;
    switch (subject) {
      case "Math":
        folderid = MATH;
        break;

      case "biology":
        folderid = BIOLOGY;
        break;

      case "Chemistry":
        folderid = CHEMISTRY;
        break;

      case "physics":
        folderid = PHYSICS;
        break;
      default:
        folderid = GOOGLE_API_FOLDER_ID;
        break;
    }
    console.log(filename);
    const fileMetaData = {
      name: `${classnumber}`+filename,
      parents: [folderid],
    };

    const media = {
      mimeType: "video/mp4",
      body: fs.createReadStream(
        path.resolve(__dirname, "./temp", "output.mp4")
      ),
    };

    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      field: "id",
    });
    return { status: true, id: response.data.id };
  } catch (err) {
    console.log("Upload file error", err);
    return { status: false, id: null, error: err };
  }
}

module.exports = uploadFile;
