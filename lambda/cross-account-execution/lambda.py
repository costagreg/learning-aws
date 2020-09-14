import boto3
import json

def handler(context, event):
    sts_connection = boto3.client('sts')
    acct_b = sts_connection.assume_role(
        RoleArn="arn:aws:iam::${accountBId}:role/myLambdaAccountBRole",
        RoleSessionName="cross_acct_lambda"
    )

    ACCESS_KEY = acct_b['Credentials']['AccessKeyId']
    SECRET_KEY = acct_b['Credentials']['SecretAccessKey']
    SESSION_TOKEN = acct_b['Credentials']['SessionToken']

    # create service client using the assumed role credentials, e.g. S3
    s3 = boto3.client(
        's3',
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        aws_session_token=SESSION_TOKEN,
    )

    allbuckets = s3.list_buckets()

    data = [{'#BUCKET_NAME': bucket["Name"]} for bucket in allbuckets['Buckets']]
    data = {'data':data}
    response = json.dumps(data)

    return response
