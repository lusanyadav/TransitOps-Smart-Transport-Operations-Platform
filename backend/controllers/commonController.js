const { poolPromise } = require("../database/db_online");
const sql = require("mssql");

const getAllCommon = async (req, res) => {
  try {
    let {
      page = 1,
      pageSize = 10,
      whereClause,
      orderby,
      selectedValue,
      groupBy,
      table,
    } = req.query;

    page = Number(page);
    pageSize = Number(pageSize);
    const offset = (page - 1) * pageSize;

    if (!table) {
      return res.status(400).json({ message: "Table name is required" });
    }

    const pool = await poolPromise;

    const where = whereClause ? `WHERE ${whereClause}` : "";
    const order = orderby ? `ORDER BY ${orderby}` : "";
    const group = groupBy ? `GROUP BY ${groupBy}` : "";
    const query = `
      SELECT ${selectedValue || "*"}
      FROM ${table}
      ${where}
      ${group}
      ${order}
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY;
    `;

    const totalQuery = `
      SELECT COUNT(*) AS total
      FROM ${table}
      ${where};
    `;

    const result = await pool.request().query(query);
    const totalResult = await pool.request().query(totalQuery);

    res.json({
      data: result.recordset,
      total: totalResult.recordset[0].total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getCommonUniqueData = async (req, res) => {
  const { table, field, value, company, id } = req.body;
  const pool = await poolPromise;
  const query = `
            SELECT * 
            FROM ${table} 
            Where ${field}= ${value} And compnay = ${company}
        `;
  const [result] = await Promise.all([pool.request().query(query)]);

  if (result.recordset.length > 0) {
    res.json({
      message: `The ${field} "${value}" is already in use.`,
      status: false,
    });
  }
};

const getSingleCommon = async (req, res) => {
  try {
    const { id } = req.params; // id from URL path /:id
    const { table, idField = "id" } = req.query; // table and optional idField from query string

    if (!table) {
      return res.status(400).json({ message: "Table name is required" });
    }

    if (!id) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

    const pool = await poolPromise;

    const query = `
      SELECT * FROM ${table}
      WHERE ${idField} = @id;
    `;

    const request = pool.request();
    request.input("id", sql.Int, id);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ data: result.recordset[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const createManyCommon = async (req, res) => {
  try {
    const { table, records } = req.body;
    if (
      !table ||
      !records ||
      typeof records !== "object" ||
      Array.isArray(records)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid 'table' or 'records' in request body" });
    }

    const pool = await poolPromise;
    const request = pool.request();

    const entries = Object.entries(records);

    if (entries.length === 0) {
      return res.status(400).json({ message: "No fields provided for insert" });
    }

    const columns = entries.map(([key]) => key).join(", ");

    const values = entries
      .map(([_, value], index) => {
        const paramName = `param_${index}`;
        request.input(paramName, value);
        return `@${paramName}`;
      })
      .join(", ");

    const query = `
      INSERT INTO ${table} (${columns})
      OUTPUT INSERTED.*
      VALUES (${values});
    `;

    const result = await request.query(query);

    res.json({
      message: "Record created successfully",
      id: result.recordset[0].id,
    });
  } catch (err) {
  console.error(err);

  if (err.number === 2627 || err.number === 2601) {
    const message = err.originalError?.info?.message || "";

    // Extract duplicate value
    const duplicateMatch = message.match(/duplicate key value is \((.*?)\)/);
    const duplicateValue = duplicateMatch ? duplicateMatch[1] : null;

    // Extract constraint name
    const constraintMatch = message.match(
      /constraint '([^']+)'/
    );
    const constraintName = constraintMatch
      ? constraintMatch[1]
      : null;

    let columnName = null;

    if (constraintName) {
      const pool = await poolPromise;

      const columnResult = await pool
        .request()
        .input("constraintName", constraintName)
        .query(`
          SELECT c.name AS column_name
          FROM sys.indexes i
          INNER JOIN sys.index_columns ic 
            ON i.object_id = ic.object_id 
            AND i.index_id = ic.index_id
          INNER JOIN sys.columns c 
            ON ic.object_id = c.object_id 
            AND ic.column_id = c.column_id
          WHERE i.name = @constraintName;
        `);

      columnName =
        columnResult.recordset[0]?.column_name || null;
    }

    return res.status(409).json({
      message: "Duplicate record found",
      field: columnName,
      value: duplicateValue,
      error: `${columnName || "Field"} '${duplicateValue}' already exists`,
    });
  }

  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
}
};

const updateCommon = async (req, res) => {
  try {
    const { id } = req.params;
    const { table, records } = req.body;

    if (
      !table ||
      !records ||
      typeof records !== "object" ||
      Array.isArray(records)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid 'table' or 'records' in request body" });
    }

    if (id === undefined || id === null) {
      return res
        .status(400)
        .json({ message: "'id' parameter is required for update" });
    }

    records.update_dt = new Date();

    const pool = await poolPromise;
    const request = pool.request();

    const filteredEntries = Object.entries(records).filter(
      ([key]) => key !== "id"
    );

    if (filteredEntries.length === 0) {
      return res.status(400).json({ message: "No updatable fields provided" });
    }

    const setClause = filteredEntries
      .map(([key, value], index) => {
        const paramName = `param_${index}`;
        request.input(paramName, value);
        return `${key} = @${paramName}`;
      })
      .join(", ");

    request.input("id", id);

    const query = `
            UPDATE ${table}
            SET ${setClause}
            WHERE ${table}_id = @id;
        `;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ message: "Record not found or no changes made" });
    }

    res.json({ message: "Record updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const deleteCommon = async (req, res) => {
  try {
    const { table, whereClause } = req.body;
    const pool = await poolPromise;

    const query = `
            DELETE FROM ${table}
            WHERE ${whereClause};
        `;
    const request = pool.request();
    await request.query(query);

    res.json({ message: "Record(s) deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


module.exports = {
  getAllCommon,
  createManyCommon,
  updateCommon,
  deleteCommon,
  getSingleCommon,
  getCommonUniqueData,
};
