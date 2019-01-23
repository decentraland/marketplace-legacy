#!/bin/bash

DB_HOST=''
DB_USER='marketplace'
DB_NAME='marketplace'
DUMP_FILEPATH='/tmp/marketplace-mainnet-latest.sql.gz'
BUCKET_TARGET='s3://market-prod.decentraland.org/dumps/'

pg_dump -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} | gzip -f > ${DUMP_FILEPATH}
aws s3 cp ${DUMP_FILEPATH} ${BUCKET_TARGET} --acl public-read
/bin/rm -f ${DUMP_FILEPATH}
