## Experiment

A lambda function invoked asynchronous when a user upload an image to an S3 bucket.
The image uploaded will be blured and saved in the same bucket.

## AWS SAM

- **Build the SAM template**
Build the SAM template
```shell
sam build
```
- **Deploy the SAM template**
```
sam deploy --guided
```


## AWC CLI

### 1. Install dependencies
```shell
npm i
```

### 2. Create a IAM role for your lambda
```shell
aws iam create-role --role-name ${myLambdaRole} --assume-role-policy-document file://trust-policy.json
```

### 3. Add the AWSLambdaBasicExecutionRole managed policy to your IAM role
```shell
aws iam attach-role-policy --role-name ${myLambdaRole} --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### 4. Compress the code
```shell
zip -r function.zip lambda.js node_modules
```

### 5. Create a lambda function

- **Get your account id**
```shell
aws sts get-caller-identity --query Account --output text
```

- **Create your function**
```shell
aws lambda create-function --function-name ${myLambdaName} \
--zip-file fileb://function.zip --handler index.handler --runtime nodejs12.x \
--timeout 10 --memory-size 512 \
--role arn:aws:iam::${myAccountId}:role/${myLambdaRole}
```
### 6. Create an s3 bucket
```shell
aws s3api create-bucket --bucket ${myS3Bucket}
```

### 7. Add a resource policy to allow S3 permission to invoke your function

```shell
aws lambda add-permission --function-name ${myLambdaName} --statement-id uniqueid123 --action "lambda:InvokeFunction" --principal s3.amazonaws.com --source-arn "arn:aws:s3:::${myS3Bucket}"
```
### 8. Attach events to the s3 bucket
- **Open notification.json and change yourLambdaArn to the Lambda Arn created above.**
- **Create S3 notification**
```shell
aws s3api put-bucket-notification-configuration --bucket mys3buckettest123 --notification-configuration file://notification.json
```

### 9. Add policy to role to access the s3 bucket
- **Open S3Policy.json and change myS3Bucket to the bucket your create above**
- **Add policy to the IAM role**
```shell
aws iam put-role-policy --role-name Test-Role --policy-name ExamplePolicy --policy-document file://S3Policy.json
```