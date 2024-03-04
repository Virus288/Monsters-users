#!/bin/bash

echo "Starting migrations"

npm run migrate:prod

echo "Starting service"

node build/src/main.js
