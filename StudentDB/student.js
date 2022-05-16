const express = require('express');
const app = express();
const studentdb = {
};
const awsConfig = require('../awsConfig.json');
let aws = require('aws-sdk');
aws.config.update(awsConfig);
let docClient = new aws.DynamoDB.DocumentClient();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.get("/", (req, res) => {
    res.render('student');
});
let idNums = 0;

app.get("/api/student", async (req, res) => {
    docClient.scan({"TableName": "StudentDB"}, function (err, data) {
        if (err) {
            res.send("ERROR: " + JSON.stringify(err));
        } else {
            res.json(data); // Scan
        }
    });
});
app.get("/api/student/:studentid", async (req, res) => {
    let studentid = req.params.studentid;
    let studentObj;
    console.log(studentid);
    docClient.get({TableName: "StudentDB", Key: {"id": parseInt(studentid)}}, function (err, data) { // parseInt because in db, the id is a number
        if (err) {
            res.send("ERROR: " + JSON.stringify(err));
        } else {
            if (data.Item) {
                res.json(data.Item);
            } else {
                res.sendStatus(400); // Read an Item
            }
        }
    });
});
app.post("/api/student", (req, res) => {
    let id = ++idNums;
    let data = req.body;
    if (!('name' in data || 'currentClass' in data || 'Division' in data)) {
        res.sendStatus(400);
    } else {
        let student = {...data, id};
        docClient.put({"TableName": "StudentDB", Item: student}, function (err, data) {
            if (err) {
                res.send("ERROR: " + JSON.stringify(err));
            } else {
                res.send(student); // Write
            }
        });
    }
});
app.put("/api/student/:studentid", (req, res) => {
    let id = req.params.studentid;
    let data = req.body;
    if (!('name' in data || 'currentClass' in data || 'Division' in data)) {
        res.sendStatus(400);
    } else {
        let updateEx = `set ${'name' in data ? '#n = :nn': ''}${'name' in data && Object.keys(data).length > 1 ? ', ' : ''}`;
        updateEx += `${'currentClass' in data ? 'currentClass = :cc': ''}`;
        updateEx += `${'currentClass' in data && Object.keys(data).length > ('name' in data ? 2 : 1) ? ', ' : ''}`;
        updateEx += `${'Division' in data ? 'Division = :d': ''}`;
        console.log(updateEx);
        let exAtNames = {};
        let exAtValues = {};
        if ('name' in data) {
            exAtNames['#n'] = 'name';
            exAtValues[':nn'] = data.name;
        }
        if ('currentClass' in data) {
            exAtValues[':cc'] = data.currentClass;
        }
        if ('Division' in data) {
            exAtValues[':d'] = data.Division;
        }
        console.log(exAtValues);
        let params = {ConditionExpression: "attribute_exists(id)", ExpressionAttributeNames:exAtNames, UpdateExpression: updateEx, ExpressionAttributeValues:exAtValues, TableName: "StudentDB", Key: {"id": parseInt(id)}};
        console.log(params);
        docClient.update(params, function (err, data) {
            if (err) {
                if (err.code === "ConditionalCheckFailedException") {
                    res.sendStatus(404);
                } else {
                    res.send("ERROR: " + JSON.stringify(err));
                }
            } else {
                res.send(data); // Write
            }
        });
    }
});
app.delete("/api/student/:studentid", (req, res) => {
    let id = req.params.studentid; // Delete
    docClient.delete({ConditionExpression: "attribute_exists(id)", TableName: "StudentDB", Key: {"id": parseInt(id)}}, function(err, data) {
        if (err) {
            if (err.code === "ConditionalCheckFailedException") {
                res.sendStatus(404);
            } else {
                res.send("ERROR: " + JSON.stringify(err));
            }
        } else {
            res.send("SUCCESS: " + JSON.stringify(data));
        }
    });
});

app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`));
