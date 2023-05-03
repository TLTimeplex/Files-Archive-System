import {Request, Response, NextFunction} from 'express';
import Version, {VERSION_PATTERN} from '../version';
import {CURRENT_VERSION} from '../index';

export const verifyVersion = (req : Request, res : Response, next : NextFunction) => {
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