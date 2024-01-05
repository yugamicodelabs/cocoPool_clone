FROM node:18.16.0
WORKDIR /var/www/html/coolpool
ARG ENVFILE
USER root
COPY ./ ./
COPY $ENVFILE ./.env
COPY ./package.json /.
RUN yarn install && yarn build
CMD ["npm", "start"]

