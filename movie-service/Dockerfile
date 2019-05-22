# Node v10 as the base image to support ES6
FROM node:10.15.3-jessie

# Create a new user to our new container and avoid the root user

RUN useradd --user-group --create-home --shell /bin/false nupp && \
   apt-get clean


ENV HOME=/home/nupp

WORKDIR $HOME/app

COPY . $HOME/app/

RUN chown -R nupp:nupp $HOME/* /usr/local/

RUN npm install

RUN chown -R nupp:nupp $HOME/*

USER nupp

EXPOSE 5000

CMD ["npm", "start"]



