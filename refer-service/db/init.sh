#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "clarityhub_refer_development";
  CREATE DATABASE "clarityhub_refer_test";

  GRANT ALL PRIVILEGES ON DATABASE clarityhub_refer_development to postgres;
  GRANT ALL PRIVILEGES ON DATABASE clarityhub_refer_test to postgres;
EOSQL
