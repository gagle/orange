# orange

The project uses Nx which helps to improve and simplifies the development experience.

## Setup

The setup has been carefully adapted to the needs based on the Nx project generator for Angular and Nestjs. It includes:

- Nx
- Eslint (ts, html)
- Stylelint (scss)
- Prettier (ts, scss)
- JsBeautify (html)
- Jest + Spectator
- Lintstaged + Husky
- VSCode integration
- GitHub pull request workflow validating the build, test and lint
- Docker (api)

## Development

Start frontend and api in different terminals:

```
npm run start:web
npm run start:api
```

Or just in one terminal leveraging Nx capabilities:

```
npm run nx -- run-many --target=serve --projects=api,web --parallel
```

## Build

```
npm run build:web
npm run build:api
```

# Test

Coverage 100% accomplished.

```
npm run test:web
npm run test:api
```

# Docker

3 commands are available for preparing the docker container for the api:

```
npm run docker:build      # Builds the image
npm run docker:up         # Starts the container
npm run docker:down       # Stops the container
```
