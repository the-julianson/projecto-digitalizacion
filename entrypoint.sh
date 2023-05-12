#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
  echo "Waiting for postgres..."

  while ! nc -z $PGSQL_HOST $PGSQL_PORT; do
    sleep 0.1

  done

  echo "PostgreSQL started"
fi

python manage.py migrate

exec "$@"
