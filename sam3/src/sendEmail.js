const aws = require("aws-sdk");
const ses = new aws.SES({ region: "us-east-1" });
const s3 = new aws.S3();

exports.handler = async (event) => {
    console.log(event);
    let jsonFile = {};
    if (event.name === 'Spandan') {
        jsonFile = {...event.body};
        try {
            const params = {
                Destination: {
                    ToAddresses: ["spandan.punwatkar@antstack.com"],
                },
                Message: {
                    Body: {
                        Text: { Data: JSON.stringify(jsonFile) },
                    },
                    Subject: { Data: "Test Email" },
                },
                Source: "spandan.punwatkar@antstack.com",
            };
            const response = await ses.sendEmail(params).promise();
            console.log("Success");
            return {
                message: "Success",
                "response": response
            };
        }
        catch (e) {
            console.log("Error");
            console.log(e);
            return {
                message: "Error",
                body: JSON.stringify(e)
            };
        }
    }
    else {
        console.log("Error: Unauthorised");
        return {
            message: "Unauthorised"
        };
    }
};