## Experiment
Collect Custom Metrics from AWS EC2 Instances using the put-metric-data API.

### 1. Create the instance profile

```shell
aws iam create-role --role-name ${myCloudWatchRole} --assume-role-policy-document file://trust-policy.json 
```

```shell
aws iam create-instance-profile --instance-profile-name ${myCloudWatchRole}
```
```shell
aws iam add-role-to-instance-profile --role-name ${myCloudWatchRole} --instance-profile-name ${myCloudWatchRole}
```

### 2. Add the CloudWatchAgentServerPolicy managed policy to your IAM role
```shell
aws iam attach-role-policy --role-name ${myCloudWatchRole} --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
```

### 3. Create an EC2 instance
- **See all your keys for ssh**
```shell
aws ec2 describe-key-pairs
```

- **Create a SG**
```shell
aws ec2 create-security-group --group-name ${mySecurityGroupName} --description "My security group"
```

- **Authorise SSH to SG**
```shell
aws ec2 authorize-security-group-ingress --group-name ${mySecurityGroupName} --protocol tcp --port 22 --cidr 0.0.0.0/0
```


- **Create an instance**
```shell
aws ec2 run-instances --image-id ami-0080e4c5bc078760e  --instance-type t2.micro --region us-east-1 --iam-instance-profile Name="${myCloudWatchRole}" --count 1 --key-name ${myKeyPair} --security-groups "${mySecurityGroupName}"
```

### 4. SSH to your instance
- **Get public IP adress of your new instance**
```shell
aws ec2 describe-instances
```
- **SSH into your instance**
```shell
ssh -i ${yourKey} ec2-user@${instanceIp}
```

### 5. Put metric data
- **Create a new file custom.sh**

```shell
#!/bin/bash
USEDMEMORY=$(free -m | awk 'NR==2{printf "%.2f\t", $3*100/$2 }')

aws cloudwatch put-metric-data --metric-name memory-usage-two --dimensions instanceId=${myInstanceId} --namespace "Custom" --value $USEDMEMORY
```

- **Make custom.sh executable**
```shell
chmod +x custom.sh
```

- **Run it**
```shell
./custom.sh
```