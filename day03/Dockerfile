FROM node:16

# How you build the image
# building the image
ARG APP_DIR=/app

# create the /app and cd into /app
WORKDIR ${APP_DIR}

# copy all the sources into /app
ADD main.js .
ADD package.json .
ADD package-lock.json .

# copy the following directories recursively
ADD static static
ADD views views

# Install the node modules
RUN npm ci

# How to run the image
ENV PORT=3000 
ENV API_KEY=''

EXPOSE ${PORT}

# how you start the program
ENTRYPOINT [ "node", "main.js" ]
