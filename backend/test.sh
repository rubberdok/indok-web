#!/bin/bash
set -eo pipefail
[ "DEBUG" ] && set -x

# set current working directory to the directory of the script
cd "$(dirname "$0")"

dockerImage=$1

echo "inspecting"
if ! docker inspect "$dockerImage" &> /dev/null; then
    echo $'\timage does not exist!'
    false
fi
echo "found image"

echo "trying to run"
docker run $dockerImage python manage.py test
echo "ran"

echo "Success"