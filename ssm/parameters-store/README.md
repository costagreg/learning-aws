## Experiment
Playing with AWS SSM Parameter store

### 1. Create a new secret
```shell
aws ssm put-parameter --name "${mySecretName}" --value "${mySecretValue}" --type SecureString --key-id ${myKmsKey}
```

### 2. Get parameter by path
```shell
aws ssm get-parameters --name "${mySecretName}" --with-decryption
```

### 3. Search for keys by their path
```shell
aws ssm get-parameters-by-path --query 'Parameters[*].[Name, Description, Type, Value]' --path  ${myPath} --recursive --with-decryption  --output text
```