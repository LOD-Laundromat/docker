#!/bin/bash


sudo docker run -h docker -p 9880:80 -p 9881:9881 -p 9882:9882 -i -t lodlaundromat/ldstack "$@"

#9880: nginx
#9881: ldf
#9882: sparql