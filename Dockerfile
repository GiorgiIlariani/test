FROM node:20 AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV DOCKER_USER=next


# Install OS packages
RUN <<EOF
set -e
apt-get update
apt-get upgrade -y
apt-get install -y \
    vim \
    htop \
    unzip \
    jq
EOF

RUN useradd -m -d /app -s /bin/bash ${DOCKER_USER}

USER ${DOCKER_USER}:${DOCKER_USER}

WORKDIR /app

COPY --chown=${DOCKER_USER}:${DOCKER_USER} package*.json ./
RUN npm install

COPY --chown=${DOCKER_USER}:${DOCKER_USER} . ./

RUN npm run lint


FROM base AS build

# In order to invalidate cache if .env content changes
ARG ENV_HASH
RUN --mount=type=secret,id=.env,target=.env,mode=0444 \
    npm run build

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=$SENTRY_RELEASE

EXPOSE 3000

CMD ["npm", "run", "start"]
