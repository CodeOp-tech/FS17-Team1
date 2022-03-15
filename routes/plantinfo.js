var express = require("express");
var router = express.Router();
const db = require("../model/helper");
//working
router.get("/", async (req, res) => {
  try {
    let results = await db("SELECT * FROM plantinfo ORDER BY id ASC;");

    res.send(results.data);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
//working
router.get("/:id", async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await db(`SELECT * FROM plantinfo WHERE  id = ${id}`);
    if (result.data.length === 1) {
      res.send(result.data);
    } else {
      res.status(404).send({ error: err.message });
    }
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

//working
router.post("/", async (req, res) => {
  let {
    userid,
    pid,
    lastwater,
    lastfert,
    lastrepot,
    notes,
    userimage,
    startdate,
  } = req.body;

  let sql = `
  INSERT INTO plantinfo (userid, pid, lastwater, lastfert, lastrepot, notes, userimage, startdate) 
  VALUES ('${userid}','${pid}','${lastwater}','${lastfert}','${lastrepot}','${notes}','${userimage}','${startdate}');
`;

  try {
    await db(sql);

    let result = await db("SELECT * FROM plantinfo");

    res.send(result.data);
  } catch (err) {
    res.status(500).send({ error: err.message }, "***on catch");
  }
});
//working, only for notes, waiting on Jim's for rest
router.patch("/:id", async (req, res) => {
  let id = req.params.id;
  let { notes } = req.body;
  let sqlCheckID = `SELECT * FROM plantinfo WHERE id = ${id}`;
  let sqlUpdate = `UPDATE plantinfo SET notes = '${notes}' WHERE id = ${id}`;

  try {
    let result = await db(sqlCheckID);
    if (result.data.length === 0) {
      res.status(404).send({ error: "plant not found!" });
    } else {
      await db(sqlUpdate);
      let result = await db("select * from plantinfo");
      res.status(201).send(result.data);
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//working
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let result = await db(`SELECT * FROM plantinfo WHERE  id = ${id}`);

    if (result.data.length === 1) {
      await db(`DELETE FROM plantinfo WHERE id = ${id}`);
      result = await db("SELECT * FROM plantinfo");
      res.send(result.data);
    } else {
      res
        .status(404)
        .send({ error: "Item not found, we don't have a plant with that id" });
    }
  } catch (err) {
    res.status(500).send("catch error on delete", { error: err.message });
  }
});

module.exports = router;
