#!/bin/bash

AWS='aws'
ENTRY_POINT_APP='index.html'
ENTRY_POINT_BKP='index-main.html'

cmd_exists () {
  echo `command -v $1`
}

s3_exists () {
  local ret=`$AWS s3 ls $1`
  if [[ $ret == '' ]]; then
    echo 0
  else 
    echo 1
  fi
}

down () {
  $AWS s3 cp $BUCKET/$ENTRY_POINT_APP $BUCKET/$ENTRY_POINT_BKP
  $AWS s3 cp $ENTRY_POINT_APP $BUCKET/$ENTRY_POINT_APP --acl public-read
}

up () {
  $AWS s3 cp $BUCKET/$ENTRY_POINT_BKP $BUCKET/$ENTRY_POINT_APP --acl public-read
  $AWS s3 rm $BUCKET/$ENTRY_POINT_BKP
}

refresh_cache () {
  $AWS configure set preview.cloudfront true && aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID  --paths "/" "/*"
}

print_help () {
  echo 'Available commands:'
  echo '  - down <bucket> <distribution-id>: Take the site down for maintenance'
  echo '  - up <bucket> <distribution-id>: Restore the site back up'  
}

# Preconditions

if [[ $(cmd_exists $AWS) == '' ]]; then
  echo 'ERROR: '$AWS' command not found'
  exit 1
fi

# Parse args

CMD=$1
BUCKET=$2
DISTRIBUTION_ID=$3

if [[ $BUCKET == '' ]]; then
  echo 'ERROR: You need to specify the S3 bucket to use'
  print_help
  exit 1
fi

if [[ $DISTRIBUTION_ID == '' ]]; then
  echo 'ERROR: You need to specify the CloudFront distribution to refresh'
  print_help
  exit 1
fi

# Commands

if [[ $CMD == 'down' ]]; then
  echo '[down] - Going under maintenance'
  if [[ $(s3_exists $BUCKET/$ENTRY_POINT_BKP) == '1' ]]; then
    echo '[down] - The site is already under maintenance'
    exit 1
  fi
  down
  refresh_cache
elif [[ $CMD == 'up' ]]; then
  echo '[up] - Going back up'
  up
  refresh_cache
else
  print_help
fi
