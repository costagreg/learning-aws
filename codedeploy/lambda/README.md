## Experiment
Playing with CodeDeploy and Lambda. 
https://aws.amazon.com/blogs/compute/implementing-safe-aws-lambda-deployments-with-aws-codedeploy/

### 1. Deploy v1
```shell
sam package --template-file template.yaml --s3-bucket ${mybucketname} --output-template-file packaged.yaml

sam deploy --template-file packaged.yaml --stack-name mySafeDeployStack --capabilities CAPABILITY_IAM
```

### 2. Change returnS3Buckets and deploy v2
```shell
sam package --template-file template.yaml --s3-bucket ${mybucketname} --output-template-file packaged.yaml

sam deploy --template-file packaged.yaml --stack-name mySafeDeployStack --capabilities CAPABILITY_IAM
```