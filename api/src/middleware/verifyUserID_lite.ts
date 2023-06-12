import { Request, Response, NextFunction } from 'express';

export const verifyUserID_lite = (req: Request, res: Response, next: NextFunction) => {
  const userID = req.params.userID;
  if (!userID)
    return res.status(400).send("User ID not provided");
  try {
    parseInt(userID);
  }
  catch (e) {
    return res.status(400).send("User ID is not a number");
  }
  return next();
}

export default verifyUserID_lite;