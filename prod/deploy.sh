#!/bin/bash

# load env variables
ENVFILE="$(dirname "$0")/.env.provision"
if [ -f $ENVFILE ]
then
 source $ENVFILE
fi

ssh $SSH_CONNECTION "cd $DEPLOY_DIR
docker-compose pull bot
docker-compose restart bot"