#!/bin/sh

set -e
./wait-for postgres:5432
exec "$@"
