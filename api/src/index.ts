import express, {Request, Response, NextFunction} from 'express';

const app = express();

//DEFINE CONSTANTS
const versionPattern = /^\d+(\.\d+){0,2}$/;

const currentVersion = "1.0.0";

const PORT = process.env.PORT || 3000;

//DEFINE MIDDLEWARE

//Version system check
const verifyVersion = (req : Request, res : Response, next : NextFunction) => {
  if(req.originalUrl === "/")
    return res.status(400).send("Version is required<br\>url/X[.Y[.Z]]/...");

  const version = req.originalUrl.split('/')[1];

  if(!versionPattern.test(version))
    return res.status(400).send("Invalid version");

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


//GLOBAL MIDDLEWARE
app.use(verifyVersion);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
//Echo version
app.get('/:version', (req, res) => {
  return res.send({version : req.params.version});
});

//Login (Get token)
app.post('/:version/login/:username', (req, res) => {
  const username = req.params.username;
  const password = req.body.password;

  return res.send({username, password});
});

//Authenticate token
app.get('/:version/:token', (req, res) => {
  return res.send({token : req.params.token});
  });



//START SERVER
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
