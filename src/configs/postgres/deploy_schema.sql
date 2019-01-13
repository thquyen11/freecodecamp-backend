-- Deploy fresh database tabels:
\i '/docker-entrypoint-initdb.d/schema/roles.sql'
\i '/docker-entrypoint-initdb.d/schema/db.sql'

-- For testing purposes only. This file will add dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'