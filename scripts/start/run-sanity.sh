#!/bin/bash

PROC_PATH='/home/ubuntu/app'
PROC_NAME='self-heal'

log () {
    echo "(Process:${PROC_NAME}) $1"
}

run () {
    cd $PROC_PATH && npm run sanity-check -- --from-block=4900000 --websocket --self-heal
}

main () {
    export BATCH_SIZE=100
    export SKIP_TILES_CACHE_UPDATE=1

    if ! pgrep -f ${PROC_NAME} > /dev/null
    then
        log 'Starting'
        run
    else
        log 'Already running'
    fi
}

main