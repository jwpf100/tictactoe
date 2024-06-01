## Setup Database

psql -c 'drop database if exists tictactoe;'
psql -c 'create database tictactoe;'

## Add table

Use SQL query in api/migrations/2024-06-01-001-initial-setup to add table to db

## Set up db connection

Set `connectionString` in `server.js` file

## Start api

In api directory run `npm run start`