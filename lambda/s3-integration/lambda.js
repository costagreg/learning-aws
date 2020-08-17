const AWS = require("aws-sdk");
const jimp = require("jimp");
const s3 = new AWS.S3();

const isSupportedImage = (url) => {
  const supportedImageTypes = ["jpg", "png"];
  const typeMatch = url.match(/\.([^.]*)$/);

  if (!typeMatch) {
    return false;
  }

  const imageType = typeMatch[1].toLowerCase();
  if (!supportedImageTypes.includes(imageType)) {
    return false;
  }

  return true;
};

exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  if (!isSupportedImage(srcKey)) {
    console.log(`${srcKey} is not supported`);

    return;
  }

  try {
    const dstKey = `bluredImages/${srcKey}`;
    const origimage = await s3
      .getObject({
        Bucket: bucket,
        Key: srcKey,
      })
      .promise();

    const buffer = Buffer.from(origimage.Body,  'base64')
    const image = await jimp.read(buffer);
    const bluredImage = image.blur(2);
    const newBuffer = await bluredImage.getBufferAsync(jimp.AUTO);

    await s3
      .putObject({
        Bucket: bucket,
        Key: dstKey,
        Body: newBuffer,
        ContentType: "image",
      })
      .promise();

    console.log(
      `Successfully blured image and saved to ${dstKey}/`
    );
  } catch (error) {
    console.log(error);
  }
};
