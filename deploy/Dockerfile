# ================================================================================================
# === Stage 1: Build and bundle the React app with the CRA CLI ===================================
# ================================================================================================
FROM node:12-alpine as bundle

ARG CLIENT_ID=""
ENV REACT_APP_CLIENT_ID=${CLIENT_ID}

WORKDIR /build

# Install all packages and app dependencies 
COPY ./package*.json ./
RUN npm install --silent

# Copy in the app source
COPY ./public ./public
COPY ./src ./src

# Now build & bundle, this will output to ./build (i.e. /build/build)
RUN npm run build

# ================================================================================================
# === Stage 2: Copy static bundle into NGINX server ==============================================
# ================================================================================================
FROM nginx:mainline-alpine

COPY deploy/default.conf /etc/nginx/conf.d/

# Copy in output from React bundle (the dist)
COPY --from=bundle /build/build /var/www/html

EXPOSE 80
