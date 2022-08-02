FROM postgres:9.6

ADD ./refer-service/db/init.sh /docker-entrypoint-initdb.d/refer-service.sh