#!/bin/sh
set -e

export CLOUDINARY_URL=cloudinary://$CLOUDINARY_API_KEY:$CLOUDINARY_API_SECRET@$CLOUDINARY_CLOUD_NAME
cld sync --push -F -K .next/static/media _next/static/media

exec "$@"
