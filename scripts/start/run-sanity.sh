#!/bin/bash

PROC_PATH='/home/ubuntu/marketplace'
PROC_NAME='sanityCheck.js'

log () {
    echo "(Process:${PROC_NAME}) $1"
}

run () {
    cd $PROC_PATH && npm run sanity-check -- --self-heal
}

main () {
    if ! pgrep -f ${PROC_NAME} > /dev/null
    then
        log 'Starting'
        run
    else
        log 'Already running'
    fi
}

main
