const express = require('express');
const app = express();
const studentdb = {
};
let idNums = 0;
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.get("/", (req, res) => {
    res.render('student');
});

app.get("/api/student", async (req, res) => {
    res.json(studentdb);
});
app.get("/api/student/:studentid", async (req, res) => {
    let studentid = req.params.studentid;
    if (studentid in studentdb) {
        res.json(studentdb[studentid]);
    } else {
        res.sendStatus(400);
    }
});
app.post("/api/student", (req, res) => {
    let id = ++idNums;
    let data = req.body;
    if (!('name' in data || 'currentClass' in data || 'Division' in data)) {
        res.sendStatus(400);
    } else {
        studentdb[`${id}`] = {...data, id};
        res.send(studentdb[`${id}`]);
    }
});
app.put("/api/student/:studentid", (req, res) => {
    let id = req.params.studentid;
    let data = req.body;
    if (!('name' in data || 'currentClass' in data || 'Division' in data || id in studentdb)) {
        res.sendStatus(400);
    } else {
        studentdb[`${id}`] = {...data, id};
        res.send(studentdb[`${id}`]);
    }
});
app.delete("/api/student/:studentid", (req, res) => {
    let id = req.params.studentid;
    if (!((`${id}`) in studentdb)) {
        res.sendStatus(404);
    } else {
        delete studentdb[`${id}`];
        res.send(`Deleted ${id}`);
    }
});

app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`));
