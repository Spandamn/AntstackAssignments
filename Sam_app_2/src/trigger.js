exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    let bucket = event['Records'][0]['s3']['bucket']['name'];
    let file = event['Records'][0]['s3']['object']['key'];
    let eventName = event['Records'][0]['eventName'];
    if (eventName.endsWith("Put")) {
        console.log("Triggered by S3 bucket " + bucket);
        console.log(`Object added in S3 bucket. Name: ${file}`);
        console.log("File size of object: " + event['Records'][0]['s3']['object']['size']);
        console.log(`Url of object: https://${bucket}.s3.amazonaws.com/${file}`);
    }
    callback();
};