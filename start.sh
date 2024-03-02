#!/bin/bash

echo "Starting migrations"

npm run migrate:prod

echo "Starting service"

npm run start
