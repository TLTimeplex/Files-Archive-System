import { Request, Response } from 'express';
import db from '../../db';
import { User_Data, User_Data_Select } from '../../types/API_User_Data';

export const getUserInfo = (req: Request, res: Response) => {
  let userID: number | undefined = undefined;

  const select = req.body.select as User_Data_Select | undefined;

  try {
    if (req.params.trgUserID && req.params.trgUserID !== "") {
      userID = parseInt(req.params.trgUserID);
      console.log(userID);
    }
  }
  catch (e) {
    return res.status(400).send("User ID is not a number");
  }

  db.pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      connection.release();
      return res.status(500).send("Internal server errors");
    }
    let getUserID = new Promise<number>((resolve, reject) => {
      if (userID) {
        resolve(userID);
      }
      else {
        connection.query("SELECT user_id FROM session WHERE token = ?", [req.params.token], (err, result: any[]) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          if (result.length === 0) {
            reject("User not found");
          }
          resolve(result[0].id);
        });
      }
    });
    getUserID.then((userID) => {
      connection.query("SELECT id, username FROM users WHERE id = ?", [userID], (err, result: any[]) => {
        if (err) {
          console.log(err);
          connection.release();
          return res.status(500).send("Internal server error");
        }
        if (result.length === 0) {
          connection.release();
          return res.status(404).send("User not found");
        }
        let user = result[0];

        let output: User_Data = {};

        if (!select || select.id)
          output.id = user.id;

        if (!select) {
          connection.release();
          return res.status(200).send({ success: true, data: output });
        }

        if (select.username)
          output.username = user.username;

        if (select.group_id) {
          connection.query("SELECT group_id FROM user_group WHERE user_id = ?", [userID], (err, result: any[]) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal server error");
            }
            output.group_id = [];
            for (let i = 0; i < result.length; i++) {
              output.group_id.push(result[i].group_id);
            }
            connection.release();
            return res.status(200).send({ success: true, data: output });
          });
        } else {
          connection.release();
          return res.status(200).send({ success: true, data: output });
        }

      });
    }).catch((err) => {
      console.log(err);
      connection.release();
      return res.status(200).send({ success: false, message: err });
    });
  });

};

export default getUserInfo;