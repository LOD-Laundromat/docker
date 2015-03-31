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
    curl \
    git \
    nano \
    emacs \
    screen \
    htop \
    nginx \
    nginx-extras \
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
EXPOSE $PORT_SPARQL
#EXPOSE 9882




#### Triple Pattern Fragments API
RUN git clone https://github.com/LinkedDataFragments/Server.js.git $LDF_DIR && \
    cd $LDF_DIR && \
    git checkout develop && \
    npm update;
    
COPY ldf/config.json $LDF_DIR/config.json
#COPY nginx/ldf /etc/nginx/sites-enabled/ldf
EXPOSE $PORT_LDF
#EXPOSE 9881
    
#### Triple Pattern Fragments SPARQL interface
RUN git clone https://github.com/LinkedDataFragments/Browser.js.git $LDF_CLIENT_DIR && \
    cd $LDF_CLIENT_DIR && \
    npm install && \
    npm run postinstall;
    
#### Brwsr
RUN git clone https://github.com/LaurensRietveld/brwsr.git && \
    cd brwsr &&   \
    git checkout dev && \
    pip install -r requirements.txt;
COPY brwsr/config.py /home/ldstack/brwsr/src/app/config.py




#### SPARQL content negotiator
COPY sparqlNegotiator /home/ldstack/sparqlNegotiator
RUN cd /home/ldstack/sparqlNegotiator && \
    npm install;


#### Init interface
COPY interface /home/ldstack/interface
RUN cd /home/ldstack/interface && \
    npm install;




#### Nginx
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf;
COPY nginx/sites-available /etc/nginx/sites-available
COPY nginx/locations80-available /etc/nginx/locations80-available
RUN cd /etc/nginx && \
    rm sites-enabled/* && \
    cd sites-enabled && \
    ln -s ../sites-available/* . && \
    cd ../ && \
    mkdir locations80-enabled && \
    cd locations80-enabled && \
    ln -s ../locations80-available/* .;
EXPOSE 80
#EXPOSE 9880
EXPOSE $PORT_NGINX






##############
# place somewhere else later
##############
RUN mkdir $DATA_DIR/downloads;


##############
# Post Processing
##############

RUN mkdir /home/ldstack/bin && echo "export PATH=/usr/local/virtuoso-opensource/bin:/home/ldstack/bin:\$PATH" >> /home/ldstack/.bashrc && echo "export PATH=/usr/local/virtuoso-opensource/bin:/home/ldstack/bin:\$PATH" >> /root/.bashrc
COPY bin /home/ldstack/bin
RUN chown -R ldstack:ldstack /home/ldstack;


CMD ["./bin/run"]





###SOME TEST STUFF
EXPOSE 3000
EXPOSE 8890

