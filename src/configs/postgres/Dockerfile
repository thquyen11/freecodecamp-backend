FROM postgres:11.1


ADD /schema/ /docker-entrypoint-initdb.d/schema/
ADD /seed/ /docker-entrypoint-initdb.d/seed/
ADD deploy_schema.sql /docker-entrypoint-initdb.d/