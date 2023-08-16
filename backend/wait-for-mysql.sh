#!/bin/sh

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -z -v -w30 $host $port; do
    echo "Waiting for MySQL connection..."
    sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
