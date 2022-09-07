# bayquamon

## Developing

Once you've created a project and installed dependencies with `yarn install` start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

For write translation:

```bash
yarn typesafe-i18n
```

## Building

To create a production version of your app:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
