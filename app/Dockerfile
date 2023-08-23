# server/Dockerfile

# pull official base image
FROM python:3.11.4-slim-buster

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apt-get update \
  && apt-get -y install gcc postgresql netcat \
  && apt-get clean

# install dependencies
RUN pip install hupper  # Only for development
RUN pip install --upgrade pip
COPY ./requirements/ ./requirements/

RUN pip install -r requirements/local.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# copy project
COPY . .

# collect static files
RUN python manage.py collectstatic --no-input

# run entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
