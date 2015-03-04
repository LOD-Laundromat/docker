#!/bin/bash

#9880: nginx
#9881: ldf
#9882: sparql

echo "Starting LDF"
/home/ldstack/ldfServer.js/bin/ldf-server /home/ldstack/ldfServer.js/config.json 2>> /var/log/ldf.err 1>> /var/log/ldf.log &

echo "Starting SPARQL endpoint"
/usr/local/virtuoso-opensource/bin/virtuoso-t +wait +configfile /home/ldstack/virtuoso.ini;


echo "Starting Linked Data Brwsr"
python /home/ldstack/brwsr/src/run.py 2>> /var/log/brwsr.err 1>> /var/log/brwsr.log &

echo "Starting SPARQL endpoint GUI"
node /home/ldstack/sparqlNegotiator/main.js 2>> /var/log/sparqlNegotiator.err 1>> /var/log/soarqlNegotiator.log &

echo "Starting web server"
nginx;
