import express, {Request, Response, NextFunction} from 'express';
import Version, {VERSION_PATTERN} from './version';

//-----------------------------------------------------------//

const app = express();

//-----------------------------------------------------------//
//-------------------| DEFINE CONSTANTS |--------------------//
//-----------------------------------------------------------//

const CURRENT_VERSION : Version = new Version("1.0.0");

const SERVER_PORT     = process.env.PORT || 3000;

//-----------------------------------------------------------//
//-------------------| DEFINE MIDDLEWARE |-------------------//
//-----------------------------------------------------------//

//Version system check
const verifyVersion = (req : Request, res : Response, next : NextFunction) => {
  if(req.originalUrl === "/")
    return res.status(418).send({version : CURRENT_VERSION.toString()});

  const versionString = req.originalUrl.split('/')[1];

  if(!VERSION_PATTERN.test(versionString))
    return res.status(400).send("Invalid version");

  try{
  
    const version = new Version(versionString);
  
    if(CURRENT_VERSION.compareTo(version) < 0)
      return res.status(400).send("This version is not supported yet!");

  }catch(e){
    return res.status(500).send("Internal server error");
  }

  next();
};

//Authentication check
const verifyToken = (req : Request, res : Response, next : NextFunction) => {
  return res.status(501).send("Not implemented");
  if(false) {    //TODO
    return res.status(401).send("User is not authorized");
  }
  next();
};

//-----------------------------------------------------------//
//------------------| GLOBAL MIDDLEWARE |--------------------//
//-----------------------------------------------------------//

app.use(verifyVersion);

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
app.post('/:version/login/:username', (req, res) => {
  const username = req.params.username;
  const password = req.body.password;

  return res.status(501).send({username, password});
});

//Authenticate token
app.get('/:version/:token', (req, res) => {
  return res.status(501).send({token : req.params.token});
  });


//-----------------------------------------------------------//
//---------------------| START SERVER |----------------------//
//-----------------------------------------------------------//

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}.`);
});
