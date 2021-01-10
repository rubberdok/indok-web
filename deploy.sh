#!/bin/sh

JQ="jq --raw-output --exit-status"

configure_aws_cli() {
  aws --version
  aws configure set default.region eu-north-1
  aws configure set default.output json
  echo "AWS Configured!"
}

register_definition() {
  if revision=$(aws ecs register-task-definition --cli-input-json "$task_def" | $JQ '.taskDefinition.taskDefinitionArn'); then
    echo "Revision: $revision"
  else
    echo "Failed to register task definition"
    return 1
  fi
}

deploy_cluster() {

  # backend
  template="ecs_backend_taskdefinition.json"
  task_template=$(cat "ecs/$template")
  task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $AWS_RDS_HOST $AWS_RDS_PASSWORD $PRODUCTION_SECRET_KEY)
  echo "$task_def"
  register_definition

  # frontend
  template="ecs_frontend_taskdefinition.json"
  task_template=$(cat "ecs/$template")
  task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
  echo "$task_def"
  register_definition

}

configure_aws_cli
deploy_cluster