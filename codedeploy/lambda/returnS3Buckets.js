const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
  console.log(
    "I am here! " + context.functionName + ":" + context.functionVersion
  );

  s3.listBuckets(function (err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, {
        statusCode: 500,
        body: "Failed!",
      });
    } else {
      const allBuckets = data.Buckets;
      const bucketsStartingWithA = allBuckets.filter((bucket) =>
        bucket.Name.startsWith("a")
      );

      console.log(
        "Total buckets starting with a: " + bucketsStartingWithA.length
      );

      callback(null, {
        statusCode: 200,
        body: bucketsStartingWithA.length,
      });
    }
  });
};
