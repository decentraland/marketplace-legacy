#!/bin/bash

PROCESS_PATH='/home/ubuntu/marketplace'
PROCESS_NAME='sanityCheck.js'

log () {
    echo "(Process:${PROCESS_NAME}) $1"
}

run () {
    cd $PROCESS_PATH
    npm run sanity-check -- --self-heal
}

main () {
    if ! pgrep -f ${PROCESS_NAME} > /dev/null
    then
        log 'Starting'
        run
    else
        log 'Already running'
    fi
}

main
