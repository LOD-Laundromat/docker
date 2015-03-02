#!/bin/bash

service nginx start;

/ldf/ldfServer.js/bin/ldf-server "$@"