FROM ubuntu:latest
MAINTAINER Laurens Rietveld <laurens.rietveld@vu.nl>


WORKDIR /ldf
RUN mkdir -p /ldf/tmp && mkdir -p /ldf/cache;

RUN apt-get update && \
    apt-get install -y \
     git \ 
     nodejs-legacy \
     nginx \
     npm && \
    rm -rf /var/lib/apt/lists/*;

RUN git clone https://github.com/LinkedDataFragments/Server.js.git ldfServer.js && \
    cd ldfServer.js && \
    npm update;
    
COPY init.sh /ldf/init.sh
COPY /ldfConfig.json /ldf/config.json
COPY nginx_ldf.conf /etc/nginx/sites-enabled/ldf
RUN rm /etc/nginx/sites-enabled/default

EXPOSE 80
CMD ["/ldf/init.sh", "/ldf/config.json"]


