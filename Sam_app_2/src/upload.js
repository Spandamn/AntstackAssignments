const aws = require('aws-sdk');
const s3 = new aws.S3();
const config = {
    apiVersion: "2012-08-10",
    region: "us-east-1",
};

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    let bucketName = process.env.BUCKET_NAME;
    const file = JSON.parse(event.body);
    try {
        const params = {
            Bucket: bucketName,
            Key: `uploaded/${file.id || "samplename"}`,
            Body: event.body,
            ContentType: 'application/json charset=utf-8'
        }
        let resp = await s3.putObject(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify(resp)
        };
    }
    catch (e) {
        console.log("ERROR ")
        console.log(JSON.stringify(e));
        return {
            statusCode: 400,
            body: JSON.stringify(e)
        };
    }
};