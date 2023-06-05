import express, { Request, Response, NextFunction } from 'express';
import Version, { VERSION_PATTERN } from './version';
import db from './db';
import * as endware from './endware';
import middleware from './middleware';
import cors from 'cors';
import multer from 'multer';
//import { dropScheme } from './db/drop';
//dropScheme(db.pool);
//import bycrypt from 'bcrypt';
//console.log(bycrypt.hashSync("123", 12));

//-----------------------------------------------------------//

const app = express();

//-----------------------------------------------------------//
//-------------------| DEFINE CONSTANTS |--------------------//
//-----------------------------------------------------------//

export const CURRENT_VERSION: Version = new Version("1.0.0");

export const SERVER_PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

//-----------------------------------------------------------//
//-----------------------| DB STUFF |------------------------//
//-----------------------------------------------------------//

db.autoInit();

//-----------------------------------------------------------//
//------------------| GLOBAL MIDDLEWARE |--------------------//
//-----------------------------------------------------------//

app.use(middleware.verifyVersion);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//-----------------------------------------------------------//
//------------------------| ROUTES |-------------------------//
//-----------------------------------------------------------//

//Echo version
app.get('/:version', (req, res) => {
  return res.send({ version: req.params.version });
});

//Login (Get token)
app.post('/:version/login/:username', endware.login);

//Authenticate token
app.get('/:version/:token', middleware.verifyToken, (_, res) => {
  return res.status(200).send(true);
});

app.put('/:version/:token/report', middleware.verifyToken, endware.Report.uploadReport);

app.post('/:version/:token/report', middleware.verifyToken, endware.Report.getReportIDs);

app.put('/:version/:token/report/:reportID', middleware.verifyToken, endware.Report.uploadReport);

app.get('/:version/:token/report/:reportID', middleware.verifyToken, middleware.verifyReportID, endware.Report.getReport);

app.patch('/:version/:token/report/:reportID', middleware.verifyToken, middleware.verifyReportID, endware.Report.updateReport);

app.delete('/:version/:token/report/:reportID', middleware.verifyToken, middleware.verifyReportID, endware.Report.deleteReport);

app.put('/:version/:token/report/:reportID/file', upload.single("data"), middleware.verifyToken, middleware.verifyReportID, endware.Report.File.uploadFile);

app.get('/:version/:token/report/:reportID/file', upload.single("data"), middleware.verifyToken, middleware.verifyReportID, endware.Report.File.getFileIDs);

app.put('/:version/:token/report/:reportID/file/:fileID', upload.single("data"), middleware.verifyToken, middleware.verifyReportID, endware.Report.File.uploadFile);

app.get('/:version/:token/report/:reportID/file/:fileID', middleware.verifyToken, middleware.verifyReportID, middleware.verifyReportFileID, endware.Report.File.getFile);

app.delete('/:version/:token/report/:reportID/file/:fileID', middleware.verifyToken, middleware.verifyReportID, endware.Report.File.deleteFile);

app.get('/:version/:token/report/:reportID/file/:fileID/meta', middleware.verifyToken, middleware.verifyReportID, middleware.verifyReportFileID, endware.Report.File.getFileMeta);

app.put('/:version/:token/archive', middleware.verifyToken, endware.Archive.archiveReport);

app.put('/:version/:token/archive/:reportID', middleware.verifyToken, endware.Archive.archiveReport);

/*
app.post('/:version/:token/archive', middleware.verifyToken, endware.Archive.getArchiveIDs);

app.get('/:version/:token/archive/:archiveID', middleware.verifyToken, middleware.verifyArchiveID, endware.Archive.getArchive);

app.delete('/:version/:token/archive/:archiveID', middleware.verifyToken, middleware.verifyArchiveID, endware.Archive.deleteArchive);

app.post('/:version/:token/archive/:archiveID', middleware.verifyToken, middleware.verifyArchiveID, endware.Archive.unarchiveReport);
*/
//-----------------------------------------------------------//
//---------------------| START SERVER |----------------------//
//-----------------------------------------------------------//

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}.`);
});
