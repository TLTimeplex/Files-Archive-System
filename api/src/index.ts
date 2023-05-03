import express, {Request, Response, NextFunction} from 'express';
import Version, {VERSION_PATTERN} from './version';
import db from './db';
import endware from './endware';
import middleware from './middleware';

//-----------------------------------------------------------//

const app = express();

//-----------------------------------------------------------//
//-------------------| DEFINE CONSTANTS |--------------------//
//-----------------------------------------------------------//

export const CURRENT_VERSION : Version = new Version("1.0.0");

export const SERVER_PORT     = process.env.PORT || 3000;

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

//-----------------------------------------------------------//
//------------------------| ROUTES |-------------------------//
//-----------------------------------------------------------//

//Echo version
app.get('/:version', (req, res) => {
  return res.send({version : req.params.version});
});

//Login (Get token)
app.post('/:version/login/:username', endware.loginUser);

//Authenticate token
app.get('/:version/:token', middleware.verifyToken , (_, res) => {
  return res.status(200).send(true);
  });


//-----------------------------------------------------------//
//---------------------| START SERVER |----------------------//
//-----------------------------------------------------------//

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}.`);
});
