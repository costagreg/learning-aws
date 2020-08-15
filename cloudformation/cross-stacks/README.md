## Experiment

This is an example of cross stacks in AWS cloudformation:

- ec2-instance.yml creates an EC2 that runs Apache.
- load-balancer.yml creates an Application Load Balancer with target the ec2 instance in the stack above.

## How to run it

Create EC2 instance

```shell
aws cloudformation create-stack --stack-name ec2TestStack --template-body file://ec2-instance.yml
```
Create Application Load Balancer

```shell
aws cloudformation create-stack --stack-name albTestStack --template-body file://load-balancer.yml --parameters ParameterKey=EnvironmentName,ParameterValue=Dev ParameterKey=VPC,ParameterValue=${yourVpcId} ParameterKey=Subnets,ParameterValue=\"${yourSubnetId1},${yourSubnetId2},"
```

Make sure to replace ${yourVpcId}, ${yourSubnetId1}, ${yourSubnetId2} with the respective values