## Experiment
Playing with CloudWatch and KMS
https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html

### 1. Create an AWS KMS CMK
```shell
aws kms create-key
```

### 2. Save the default policy for your CMK as policy.json
```shell
aws kms get-key-policy --key-id ${yourCMKKeyId} --policy-name default --output text > ./policy.json
```

### 3. Add the follow statement to policy.json
```json
{
  "Effect": "Allow",
  "Principal": {
    "Service": "logs.us-east-1.amazonaws.com"
  },
  "Action": [
    "kms:Encrypt*",
    "kms:Decrypt*",
    "kms:ReEncrypt*",
    "kms:GenerateDataKey*",
    "kms:Describe*"
  ],
  "Resource": "*",
  "Condition": {
    "ArnEquals": {
      "kms:EncryptionContext:aws:logs:arn": "arn:aws:logs:${awsRegion}:${yourAwsAccount}:log-group:*"
    }
  }
}
```

### 4. Associate the new policy to your new AWS CMK KEY
```shell
aws kms put-key-policy  --key-id ${yourCMKKeyId} --policy-name default --policy file://policy.json
```

### 5. Associate the AWS CMS KEY to an existing log group
```shell
aws logs associate-kms-key --log-group-name ${yourLogGroupName} --kms-key-id "${yourKeyArn}"
```

### 6. Associate the AWS CMS KEY to a new log group
```shell
aws logs create-log-group --log-group-name ${yourLogGroupName} --kms-key-id "${yourKeyArn}"
```

### 7. Disassociate a log group from a AWS CMK KEY
```shell
aws logs disassociate-kms-key --log-group-name ${yourLogGroupName}
```