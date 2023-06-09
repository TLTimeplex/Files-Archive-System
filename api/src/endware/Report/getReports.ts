import { Request, Response } from 'express';
import db from '../../db';
import ReportFilter from '../../types/ReportFilter';

export const getReportIDs = (req: Request, res: Response) => {
  const reportFilterRaw = req.body.filter;

  if (!reportFilterRaw)
    return res.status(200).send({ success: false, message: "No filters given!" });

  const reportFilter: ReportFilter = {
    author_id: reportFilterRaw.author_id,
    date_created: reportFilterRaw.date_created,
    dateRange_created: reportFilterRaw.dateRange_created,
    date_updated: reportFilterRaw.date_updated,
    dateRange_updated: reportFilterRaw.dateRange_updated,
    tags: reportFilterRaw.tags,
    title: reportFilterRaw.title,
    archived: reportFilterRaw.archived
  };

  let queryParameter: any[] = [];

  let query = "SELECT `id` FROM `fas_db`.`report` WHERE ";

  if (reportFilter.author_id) {
    query += "`author_id` IN ( ? )";
    reportFilter.author_id.forEach((id, _) => {
      if (typeof id !== "number")
        return res.status(200).send({ success: false, message: "Invalid author_id: " + id });
    });
    queryParameter.push(reportFilter.author_id);
  }

  if (reportFilter.date_created) {
    const date = reportFilter.date_created;
    if (reportFilter.author_id) query += " AND ";
    if (date.year) {
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
    if (date.month) {
      if (typeof date.month !== "number")
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      if (date.month < 0 || date.month > 12)
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      query += " AND EXTRACT(MONTH FROM `date_created`) = ?";
      queryParameter.push(date.month);
    }
    if (date.day) {
      if (typeof date.day !== "number")
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      if (date.day < 0 || date.day > 31)
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      query += " AND EXTRACT(DAY FROM `date_created`) = ?";
      queryParameter.push(date.day);
    }
    if (date.hour) {
      if (typeof date.hour !== "number")
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      if (date.hour < 0 || date.hour > 24)
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      query += " AND EXTRACT(HOUR FROM `date_created`) = ?";
      queryParameter.push(date.hour);
    }
    if (date.minute) {
      if (typeof date.minute !== "number")
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      if (date.minute < 0 || date.minute > 60)
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      query += " AND EXTRACT(MINUTE FROM `date_created`) = ?";
      queryParameter.push(date.minute);
    }
    if (date.second) {
      if (typeof date.second !== "number")
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      if (date.second < 0 || date.second > 60)
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      query += " AND EXTRACT(SECOND FROM `date_created`) = ?";
      queryParameter.push(date.second);
    }
  }

  if (reportFilter.dateRange_created) {
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

  if (reportFilter.date_updated) {
    const date = reportFilter.date_updated;
    if (reportFilter.date_created || reportFilter.dateRange_created || reportFilter.author_id) query += " AND ";
    if (date.year) {
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
    if (date.month) {
      if (typeof date.month !== "number")
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      if (date.month < 0 || date.month > 12)
        return res.status(200).send({ success: false, message: "Invalid month: " + date.month });
      query += " AND EXTRACT(MONTH FROM `date_updated`) = ?";
      queryParameter.push(date.month);
    }
    if (date.day) {
      if (typeof date.day !== "number")
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      if (date.day < 0 || date.day > 31)
        return res.status(200).send({ success: false, message: "Invalid day: " + date.day });
      query += " AND EXTRACT(DAY FROM `date_updated`) = ?";
      queryParameter.push(date.day);
    }
    if (date.hour) {
      if (typeof date.hour !== "number")
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      if (date.hour < 0 || date.hour > 24)
        return res.status(200).send({ success: false, message: "Invalid hour: " + date.hour });
      query += " AND EXTRACT(HOUR FROM `date_updated`) = ?";
      queryParameter.push(date.hour);
    }
    if (date.minute) {
      if (typeof date.minute !== "number")
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      if (date.minute < 0 || date.minute > 60)
        return res.status(200).send({ success: false, message: "Invalid minute: " + date.minute });
      query += " AND EXTRACT(MINUTE FROM `date_updated`) = ?";
      queryParameter.push(date.minute);
    }
    if (date.second) {
      if (typeof date.second !== "number")
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      if (date.second < 0 || date.second > 60)
        return res.status(200).send({ success: false, message: "Invalid second: " + date.second });
      query += " AND EXTRACT(SECOND FROM `date_updated`) = ?";
      queryParameter.push(date.second);
    }
  }

  if (reportFilter.dateRange_updated) {
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

  if (reportFilter.tags) {
    // TODO:
  }

  if (reportFilter.title) {
    if (reportFilter.author_id || reportFilter.date_created || reportFilter.dateRange_created || reportFilter.date_updated || reportFilter.dateRange_updated || reportFilter.tags) query += " AND ";
    query += "`title` LIKE ?";

    queryParameter.push("%" + reportFilter.title + "%");
  }

  if (reportFilter.archived) {
    if(reportFilter.archived !== true && reportFilter.archived !== false) return res.status(200).send({ success: false, message: "Invalid archived: " + reportFilter.archived });
    if (reportFilter.author_id || reportFilter.date_created || reportFilter.dateRange_created || reportFilter.date_updated || reportFilter.dateRange_updated || reportFilter.tags || reportFilter.title) query += " AND ";
    query += 'JSON_EXTRACT(restrictions, "$.archive") = ?';
    queryParameter.push(reportFilter.archived);
  }

  if (query.endsWith("WHERE ")) query = query.slice(0, -6);
  query += " LIMIT 100;"

  db.pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(query, queryParameter, (err, results: any[]) => {
      if (err) throw err;

      let idList: string[] = [];

      results.forEach((result, _) => {
        idList.push(result.id);
      });
      return res.status(200).send({ success: true, data: idList });
    });

  });
};

export default getReportIDs;