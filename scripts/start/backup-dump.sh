#!/bin/bash

get_filename() {
  echo 'marketplace-mainnet-'${1}'.sql.gz'
}

DB_HOST=''
DB_USER='marketplace'
DB_NAME='marketplace'
DAY_OF_WEEK=`date '+%a' | awk '{print tolower($0)}'`
DUMP_FILE_PATH='/tmp/'$(get_filename 'latest')
DUMP_FILE_DATE=$(get_filename ${DAY_OF_WEEK})
BUCKET_TARGET='s3://market-prod.decentraland.org/dumps/'

pg_dump -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} | gzip -f > ${DUMP_FILE_PATH}
aws s3 cp ${DUMP_FILE_PATH} ${BUCKET_TARGET} --acl public-read
aws s3 cp ${DUMP_FILE_PATH} ${BUCKET_TARGET}${DUMP_FILE_DATE} --acl public-read
/bin/rm -f ${DUMP_FILE_PATH}
