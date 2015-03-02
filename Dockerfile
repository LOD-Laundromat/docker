FROM ubuntu:14.04
MAINTAINER Laurens Rietveld <laurensrietveld@vu.nl>


#9880: nginx
#9881: ldf
#9882: sparql


##############
# User setup
##############
RUN adduser --disabled-password --home=/home/ldstack --gecos '' ldstack
WORKDIR /home/ldstack


 
##############
# Basic apt-get tools
##############

#### basic tools
RUN \
   apt-get update && \
   apt-get install -y software-properties-common && \
   add-apt-repository -y ppa:nginx/stable && \
   apt-get update && \
   apt-get install -y \
    wget \
    git \
    nano \
    htop \
    nginx \
    nodejs \
    nodejs-legacy \
    npm \
    build-essential \
    debhelper \
    autotools-dev \
    autoconf \
    automake \
    unzip \
    net-tools \
    libtool \
    flex \
    bison \
    gperf \
    gawk \
    m4 \
    libssl-dev \
    libreadline-dev \
    openssl \
    python-setuptools \
    python-pip \
    python-all-dev && \
   rm -rf /var/lib/apt/lists/*;


###########
# Env variables
###########
ENV PORT_NGINX 9880
ENV PORT_LDF 9881
ENV PORT_SPARQL 9882
ENV PORT_BRWSR 9883

ENV LDF_DIR /home/ldstack/ldfServer.js
ENV LDF_CLIENT_DIR /home/ldstack/ldfClient
ENV VIRTUOSO_VERSION stable/7
ENV CACHE_DIR /home/ldstack/cache
ENV TMP_DIR /home/ldstack/tmp
ENV LOG_DIR /var/log
ENV DATA_DIR /home/ldstack/data
RUN mkdir $CACHE_DIR && \
    mkdir $TMP_DIR && \
    #lmkdir $LDF_CLIENT_DIR && \
    #mkdir $LOG_DIR && \
    mkdir $DATA_DIR;
    

###########
# Custom installations
########### 


#### Virtuoso

RUN git clone https://github.com/openlink/virtuoso-opensource.git virtuoso;
RUN cd virtuoso && \
    git checkout $VIRTUOSO_VERSION && \
    ./autogen.sh && \
    export CFLAGS="-O2 -m64" && \
    ./configure && \
    make && \
    make install && \
    rm -fr /home/ldstack/virtuoso;
    

RUN cp /usr/local/virtuoso-opensource/var/lib/virtuoso/db/virtuoso.ini /home/ldstack/virtuoso.ini && \
    sed -i "s#/usr/local/virtuoso-opensource/var/lib/virtuoso/db/#$DATA_DIR/virtuoso/#" /home/ldstack/virtuoso.ini && \
    mkdir /home/ldstack/data/virtuoso;
COPY nginx/virtuoso /etc/nginx/sites-enabled/virtuoso
COPY nginx/virtuoso_80 /etc/nginx/80/virtuoso
EXPOSE $PORT_SPARQL
#EXPOSE 9882



#### Nginx
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf;
RUN mkdir /etc/nginx/80;
COPY nginx/default /etc/nginx/sites-enabled/default

EXPOSE 80
#EXPOSE 9880
EXPOSE $PORT_NGINX

#### Triple Pattern Fragments API
RUN git clone https://github.com/LinkedDataFragments/Server.js.git $LDF_DIR && \
    cd $LDF_DIR && \
    git checkout develop && \
    npm update;
    
COPY ldf/config.json $LDF_DIR/config.json
COPY nginx/ldf /etc/nginx/sites-enabled/ldf
COPY nginx/ldf_80 /etc/nginx/80/ldf
EXPOSE $PORT_LDF
#EXPOSE 9881
    
#### Triple Pattern Fragments SPARQL interface
RUN git clone https://github.com/LinkedDataFragments/Browser.js.git $LDF_CLIENT_DIR && \
    cd $LDF_CLIENT_DIR && \
    npm install && \
    npm run postinstall;
COPY nginx/ldfClient_80 /etc/nginx/80/ldfClient
    
#### Brwsr
RUN git clone https://github.com/Data2Semantics/brwsr.git && \
    cd brwsr && \
    pip install -r requirements.txt;
COPY nginx/brwsr /etc/nginx/sites-enabled/brwsr
COPY brwsr/config.py /home/ldstack/brwsr/src/app/config.py

    
#### Init admin web page
COPY html /var/www/html


##############
# Post Processing
##############
COPY run.sh /home/ldstack/run.sh

RUN chown -R ldstack:ldstack /home/ldstack;


CMD ["./run.sh"]





###SOME TEST STUFF
EXPOSE 3000
EXPOSE 8890

