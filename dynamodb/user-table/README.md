## Experiment
Playing with the AWS dynamodb CLI


### 1. Create a dynamo table with a partition key
```shell
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
      AttributeName=Surname,AttributeType=S \
      AttributeName=Name,AttributeType=S \
  --key-schema \
      AttributeName=Surname,KeyType=HASH \
      AttributeName=Name,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

### 2. List all the tables
```shell
aws dynamodb list-tables
```

### 3. Add a new item
```shell
aws dynamodb put-item \
  --table-name Users  \
  --item  '{
    "Name": {"S": "Pinco"},
    "Surname": {"S": "Pallino"},
    "Age": {"N": "18"}
  }'
```

### 4. Scan all items in your table

```shell
aws dynamodb scan \
  --table-name Users
```

### 5. Add items in batch
```shell
aws dynamodb batch-write-item \
  --request-items '{
  "Users": [
    {
      "PutRequest": {
        "Item": {
          "Name": {
            "S": "Mario"
          },
          "Surname": {
            "S": "Rossi"
          }
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "Name": {
            "S": "Giovanni"
          },
          "Surname": {
            "S": "Costa"
          },
          "Age": {
            "N": "28"
          }
        }
      }
    }
  ]
}'
```

### 4. Check items have been saved
```shell
aws dynamodb scan \
  --table-name Users
```

### 5. Update an attribute
```shell
aws dynamodb update-item \
  --table-name Users  \
  --key '{"Name": {"S": "Mario"}, "Surname": {"S": "Rossi"}}' \
  --attribute-updates '{
  "Age": {
    "Value": {
      "N": "55"
    },
    "Action": "PUT"
  }
}'
```

### 7. Query database with a given partition key
```shell
aws dynamodb query \
    --table-name Users \
    --key-condition-expression "Surname = :Surname" \
    --expression-attribute-values '{
        ":Surname": { "S": "Rossi" }
    }'
```

### 8. Add more users with the ages attribute
```shell
aws dynamodb batch-write-item \
  --request-items '{
  "Users": [
    {
      "PutRequest": {
        "Item": {
          "Name": {
            "S": "Lillo"
          },
          "Surname": {
            "S": "Pallina"
          },
          "Age": {
            "N": "20"
          }
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "Name": {
            "S": "Gianni"
          },
          "Surname": {
            "S": "Pallina"
          },
          "Age": {
            "N": "80"
          }
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "Name": {
            "S": "Pino"
          },
          "Surname": {
            "S": "Rossi"
          },
          "Age": {
            "N": "86"
          }
        }
      }
    }
  ]
}'
```

### 9. Search for users with Age of 30
```shell
aws dynamodb scan \
    --table-name Users \
    --filter-expression "Age = :Age" \
    --expression-attribute-values '{":Age":{"N":"30"}}'
```

### 10. Search for users with Age = 30: using GSI

```shell
aws dynamodb update-table \
    --table-name Users \
    --attribute-definitions AttributeName=Age,AttributeType=N \
    --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\": \"UsersAge-index\",\"KeySchema\":[{\"AttributeName\":\"Age\",\"KeyType\":\"HASH\"}],\"ProvisionedThroughput\": {\"ReadCapacityUnits\": 1, \"WriteCapacityUnits\": 1 },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]"  
```

```shell
 aws dynamodb query \
    --table-name Users \
    --index-name UsersAge-index \
    --key-condition-expression "Age = :Age" \
    --expression-attribute-values  '{":Age":{"N":"28"}}'
```

### 11. Delete table
```shell
 aws dynamodb delete-table \
    --table-name Users
```