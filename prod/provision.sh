#!/bin/bash

# load env variables
ENVFILE="$(dirname "$0")/.env.provision"
if [ -f $ENVFILE ]
then
 source $ENVFILE
fi

# install docker
ssh $SSH_CONNECTION "curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh"
# install docker-compose
ssh $SSH_CONNECTION "curl \\
-L \"https://github.com/docker/compose/releases/download/1.25.4/docker-compose-\$(uname -s)-\$(uname -m)\" \\
-o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose"
# create deploy dir
# shellcheck disable=SC2029
ssh $SSH_CONNECTION "mkdir -p $DEPLOY_DIR"
# copy docker-compose and envfile
scp "$(dirname "$0")/docker-compose.yml" $SSH_CONNECTION:$DEPLOY_DIR/docker-compose.yml
scp "$(dirname "$0")/.env.production" $SSH_CONNECTION:$DEPLOY_DIR/.env.production

