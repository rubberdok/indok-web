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

update_service() {
  if [[ $(aws ecs update-service --cluster $cluster --service $service --task-definition $revision | $JQ '.service.taskDefinition') != $revision ]]; then
    echo "Error updating service."
    return 1
  fi
}

push_images() {
  echo "pushing images"
  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/indokweb-backend:$CODEBUILD_RESOLVED_SOURCE_VERSION
  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/indokweb-frontend:$CODEBUILD_RESOLVED_SOURCE_VERSION
}

deploy_cluster() {

  cluster="indokweb-cluster"

  # backend
  service="indokweb-backend-fg-service"
  template="ecs_backend_taskdefinition.json"
  task_template=$(cat "ecs/$template")
  task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $CODEBUILD_RESOLVED_SOURCE_VERSION $AWS_RDS_HOST $AWS_RDS_PASSWORD $PRODUCTION_SECRET_KEY $DATAPORTEN_SECRET $GOOGLE_DRIVE_API_KEY $DJANGO_SETTINGS_MODULE $AWS_SECRET_ACCESS_KEY)
  echo "$task_def"
  register_definition
  update_service

  # frontend
  service="indokweb-frontend-fg-service"
  template="ecs_frontend_taskdefinition.json"
  task_template=$(cat "ecs/$template")
  task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $CODEBUILD_RESOLVED_SOURCE_VERSION)
  echo "$task_def"
  register_definition
  update_service

}

echo $CODEBUILD_RESOLVED_SOURCE_VERSION
echo $CODEBUILD_WEBHOOK_BASE_REF
echo $CODEBUILD_WEBHOOK_HEAD_REF
echo $CODEBUILD_WEBHOOK_TRIGGER
echo $CODEBUILD_WEBHOOK_EVENT


if  [ "$CODEBUILD_WEBHOOK_TRIGGER" == "branch/master" ] && \
    ([ "$CODEBUILD_WEBHOOK_HEAD_REF" == "refs/heads/master" ] || ["$CODEBUILD_WEBHOOK_WEBHOOK_EVENT" == "PULL_REQUEST_MERGED"])
then
  echo "Updating ECS."
  push_images
  configure_aws_cli
  deploy_cluster
fi