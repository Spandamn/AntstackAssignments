const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB({
    apiVersion: "2012-08-10",
    region: "us-east-1",
});
exports.handler = async (event, context, callback) => {
    console.log("Inside Lambda Function - GET" + JSON.stringify(event));
    let { fullUrl } = JSON.parse(event.body).fullUrl;
    let shortUrl = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    try {    
        let resp = await dynamodb.putItem({
            "TableName": "UrlDb", 
            Item: {
                "shortid": {S: `${shortUrl}`}, 
                "longUrl": {S: fullUrl}
            }
        }).promise();
        console.log(resp);
        shortUrl = process.env.api + shortUrl;
        return { shortUrl};
    } catch (err) {
        console.log(`ERROR: ${JSON.stringify(err)}`);
        return {
            statusCode: 400,
            body: JSON.stringify(err),
        };
    }
};
