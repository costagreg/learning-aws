## Experiment
Allow a Lambda function in its AWS Account A to access a S3 bucket in another AWS Account B.

### 1. Create an IAM role for lambda in Account A
```shell
aws iam create-role --role-name ${myLambdaRole} --assume-role-policy-document file://trust-policy-lambda.json --profile accountA
```

### 2. Add the AWSLambdaBasicExecutionRole managed policy to your IAM role
```shell
aws iam attach-role-policy --role-name ${myLambdaRole} --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --profile accountA
```

### 3. Create a cross-account roles in Account B

```shell
aws iam create-role --role-name ${myCrossAccountRole} --assume-role-policy-document file://trust-policy-lambda.json --profile accountB
```

### 4. Attach the following IAM policy to your Lambda function's execution role in account A to assume the role in account B
Replace ${accountBId} with your accountB id before executing the following command:

```shell
aws iam put-role-policy --role-name ${myLambdaRole} --policy-name ${myPolicyName} --policy-document file://trust-policy-cross-account.json --profile accountA
```

### 5. Modify the trust policy of the assumed role in account B to the following:
```shell
aws iam  update-assume-role-policy --role-name myLambdaAccountBRole --policy-document file://updated-trust-policy-cross-account.json --profile accountB

```
### 6. Attach Read S3 policy to the role in account B
```shell
aws iam attach-role-policy --role-name myLambdaAccountBRole --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess --profile accountB
```

### 7. Create lambda function

- **Compress code*
```shell
zip -r function.zip lambda.py 
```

- **Create your function**
```shell
aws lambda create-function --function-name lambdaACrossAccountTest \
--zip-file fileb://function.zip --handler lambda.handler --runtime python3.8 \
--timeout 10 --memory-size 512 \
--role arn:aws:iam::${accountBId}:role/myLambdaAccountARole
```
