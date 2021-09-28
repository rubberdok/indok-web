#!/bin/bash
set -eo pipefail
[ "DEBUG" ] && set -x

# set current working directory to the directory of the script
cd "$(dirname "$0")"

dockerImage=$1

if ! docker inspect "$dockerImage" &> /dev/null; then
    echo $'\timage does not exist!'
    false
fi

docker run $dockerImage python manage.py test || (echo "Tests failed" && exit 1)

echo "Success"