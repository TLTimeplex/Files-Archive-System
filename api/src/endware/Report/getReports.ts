import { Request, Response } from 'express';
import db from '../../db';
import ReportFilter, { ReportFieldSelect } from '../../types/ReportFilter';

export const getReportIDs = (req: Request, res: Response) => {
  const reportFilterRaw = req.body.filter;
  const reportFieldSelectRaw = req.body.select;

  const userID = parseInt(req.params.userID);

  if (!reportFilterRaw)
    return res.status(200).send({ success: false, message: "No filters given!" });

  const reportFilter: ReportFilter = {
    id: reportFilterRaw.id,
    author_id: reportFilterRaw.author_id,
    date_created: reportFilterRaw.date_created,
    dateRange_created: reportFilterRaw.dateRange_created,
    date_updated: reportFilterRaw.date_updated,
    dateRange_updated: reportFilterRaw.dateRange_updated,
    tags: reportFilterRaw.tags,
    title: reportFilterRaw.title,
    archived: reportFilterRaw.archived
  };

  const reportFieldSelect: ReportFieldSelect =
    reportFieldSelectRaw ?
      {
        id: true,
        title: reportFieldSelectRaw.title,
        description: reportFieldSelectRaw.description,
        author_id: reportFieldSelectRaw.author_id,
        date_created: reportFieldSelectRaw.date_created,
        date_modified: reportFieldSelectRaw.date_modified,
        archived: reportFieldSelectRaw.archived,
        access: reportFieldSelectRaw.access
      } :
      {
        id: true
      };

  let queryParameter: any[] = [];

  let query = "SELECT * FROM `fas_db`.`report` WHERE ";

  if (reportFilter.author_id !== undefined) {
    query += "`author_id` IN ( ? )";
    reportFilter.author_id.forEach((id, _) => {
      if (typeof id !== "number")
        return res.status(200).send({ success: false, message: "Invalid author_id: " + id });
    });
    queryParameter.push(reportFilter.author_id);
  }

  if (reportFilter.date_created !== undefined) {
    const date = reportFilter.date_created;
    if (reportFilter.author_id) query += " AND ";
    if (date.year !== undefined) {
      if (typeof date.year !== "number")
        return res.status(200).send({ success: false, message: "Invalid year: " + date.year });
      if (date.year < 0)
        return res.status(200).send({ success: false, message: "Invalid year: " + date.year });
      query += "EXTRACT(YEAR FROM `date_created`) = ?";
      queryParameter.push(date.year);
    }
    else {
      return res.status(200).send({ success: false, message: "Invalid date_created: " + date });
    }
    if (date.month !== undefined) {
      if (typeof date.month !== "number")
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      if (date.month < 0 || date.month > 12)
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      query += " AND EXTRACT(MONTH FROM `date_created`) = ?";
      queryParameter.push(date.month);
    }
    if (date.day !== undefined) {
      if (typeof date.day !== "number")
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      if (date.day < 0 || date.day > 31)
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      query += " AND EXTRACT(DAY FROM `date_created`) = ?";
      queryParameter.push(date.day);
    }
    if (date.hour !== undefined) {
      if (typeof date.hour !== "number")
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      if (date.hour < 0 || date.hour > 24)
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      query += " AND EXTRACT(HOUR FROM `date_created`) = ?";
      queryParameter.push(date.hour);
    }
    if (date.minute !== undefined) {
      if (typeof date.minute !== "number")
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      if (date.minute < 0 || date.minute > 60)
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      query += " AND EXTRACT(MINUTE FROM `date_created`) = ?";
      queryParameter.push(date.minute);
    }
    if (date.second !== undefined) {
      if (typeof date.second !== "number")
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      if (date.second < 0 || date.second > 60)
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      query += " AND EXTRACT(SECOND FROM `date_created`) = ?";
      queryParameter.push(date.second);
    }
  }

  if (reportFilter.dateRange_created !== undefined) {
    try {
      const dateRange = {
        start: new Date(reportFilter.dateRange_created.start),
        end: new Date(reportFilter.dateRange_created.end)
      }
      if (dateRange.start > dateRange.end)
        return res.status(200).send({ success: false, message: "Invalid dateRange_created: " + reportFilter.dateRange_created });

      if (reportFilter.date_created || reportFilter.author_id) query += " AND ";

      query += "`date_created` BETWEEN ? AND ?";
      queryParameter.push(dateRange);
    }
    catch (e) {
      return res.status(200).send({ success: false, message: "Invalid dateRange_created: " + reportFilter.dateRange_created });
    }
  }

  if (reportFilter.date_updated !== undefined) {
    const date = reportFilter.date_updated;
    if (reportFilter.date_created || reportFilter.dateRange_created || reportFilter.author_id) query += " AND ";
    if (date.year !== undefined) {
      if (typeof date.year !== "number")
        return res.status(200).send({ success: false, message: "Invalid year: " + date.year });
      if (date.year < 0)
        return res.status(200).send({ success: false, message: "Invalid year: " + date.year });
      query += "EXTRACT(YEAR FROM `date_updated`) = ?";
      queryParameter.push(date.year);
    }
    else {
      return res.status(200).send({ success: false, message: "Invalid date_updated: " + date });
    }
    if (date.month !== undefined) {
      if (typeof date.month !== "number")
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      if (date.month < 0 || date.month > 12)
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      query += " AND EXTRACT(MONTH FROM `date_updated`) = ?";
      queryParameter.push(date.month);
    }
    if (date.day !== undefined) {
      if (typeof date.day !== "number")
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      if (date.day < 0 || date.day > 31)
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      query += " AND EXTRACT(DAY FROM `date_updated`) = ?";
      queryParameter.push(date.day);
    }
    if (date.hour !== undefined) {
      if (typeof date.hour !== "number")
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      if (date.hour < 0 || date.hour > 24)
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      query += " AND EXTRACT(HOUR FROM `date_updated`) = ?";
      queryParameter.push(date.hour);
    }
    if (date.minute !== undefined) {
      if (typeof date.minute !== "number")
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      if (date.minute < 0 || date.minute > 60)
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      query += " AND EXTRACT(MINUTE FROM `date_updated`) = ?";
      queryParameter.push(date.minute);
    }
    if (date.second !== undefined) {
      if (typeof date.second !== "number")
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      if (date.second < 0 || date.second > 60)
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      query += " AND EXTRACT(SECOND FROM `date_updated`) = ?";
      queryParameter.push(date.second);
    }
  }

  if (reportFilter.dateRange_updated !== undefined) {
    try {
      const dateRange = {
        start: new Date(reportFilter.dateRange_updated.start),
        end: new Date(reportFilter.dateRange_updated.end)
      }
      if (dateRange.start > dateRange.end)
        return res.status(200).send({ success: false, message: "Invalid dateRange_updated: " + reportFilter.dateRange_updated });

      if (reportFilter.date_created || reportFilter.dateRange_created || reportFilter.author_id || reportFilter.date_updated) query += " AND ";

      query += "`date_updated` BETWEEN ? AND ?";
      queryParameter.push(dateRange);
    }
    catch (e) {
      return res.status(200).send({ success: false, message: "Invalid dateRange_updated: " + reportFilter.dateRange_updated });
    }
  }

  if (reportFilter.tags !== undefined) {
    // TODO:
  }

  if (reportFilter.title !== undefined) {
    if (reportFilter.author_id || reportFilter.date_created || reportFilter.dateRange_created || reportFilter.date_updated || reportFilter.dateRange_updated || reportFilter.tags) query += " AND ";
    query += "`title` LIKE ?";

    queryParameter.push("%" + reportFilter.title + "%");
  }

  if (reportFilter.archived !== undefined) {
    if (reportFilter.archived !== true && reportFilter.archived !== false) return res.status(200).send({ success: false, message: "Invalid archived: " + reportFilter.archived });
    if (reportFilter.author_id || reportFilter.date_created || reportFilter.dateRange_created || reportFilter.date_updated || reportFilter.dateRange_updated || reportFilter.tags || reportFilter.title) query += " AND ";
    query += 'JSON_EXTRACT(restrictions, "$.archive") = ?';
    queryParameter.push(reportFilter.archived);
  }

  if (reportFilter.id !== undefined) {
    if (reportFilter.author_id || reportFilter.date_created || reportFilter.dateRange_created || reportFilter.date_updated || reportFilter.dateRange_updated || reportFilter.tags || reportFilter.title || reportFilter.archived) query += " AND ";
    query += "`id` = ?";
    queryParameter.push(reportFilter.id);
  }


  if (query.endsWith("WHERE ")) query = query.slice(0, -6);
  query += " LIMIT 100;"

  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(query, queryParameter, (err, results: any[]) => {
      connection.release();
      if (err) throw err;

      let output: any[] = [];
      results.forEach((result, _) => {
        let report: any = {};
        if (reportFieldSelect.id) report.id = result.id;
        if (reportFieldSelect.title) report.title = result.title;
        if (reportFieldSelect.description) report.description = result.description;
        if (reportFieldSelect.author_id) report.author_id = result.author_id;
        if (reportFieldSelect.date_created) report.date_created = result.date_created;
        if (reportFieldSelect.date_modified) report.date_modified = result.date_modified;
        if (reportFieldSelect.archived || reportFieldSelect.access) {
          const restrictions = JSON.parse(result.restrictions);
          if (reportFieldSelect.archived) report.archived = restrictions.archive;
          if (reportFieldSelect.access) {
            if (result.author_id === userID) {
              report.access = "EDIT";
            }
            else if (false) { //TODO: If admin 
              report.access = "ADMIN";
            }
            else {
              if (restrictions.private) {
                if (restrictions.whitelist.includes(userID)) {
                  if (restrictions.archive) {
                    report.access = "VIEW";
                  } else {
                    report.access = "EDIT";
                  }
                }
                else {
                  report.access = "NONE";
                }
              }
              else {
                report.access = "VIEW";
              }
            }
          }
        }

        output.push(report);
      });
      return res.status(200).send({ success: true, data: output });
    });

  });
};

export default getReportIDs;