#!/bin/bash

echo "Access LOD2Go at http://localhost:9880"
sudo docker run -h docker -p 9880:80 -p 9881:9881 -p 9882:9882 -p 9883:9883 -i -t lodlaundromat/ldstack "$@"



#if which xdg-open > /dev/null
#then
#  xdg-open http://localhost:9880
#elif which gnome-open > /dev/null
#then
#  gnome-open http://localhost:9880
#fi


#9880: nginx
#9881: ldf
#9882: sparql


