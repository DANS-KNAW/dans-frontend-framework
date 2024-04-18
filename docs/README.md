# DANS front-end framework monorepo

The DANS front-end framework is a monorepo, using Turbo and PNPM package management and Vite build tools.

## Structure

Apps that are meant to run standalone are located in the **./apps** folder. Custom libraries that these apps can use are in **./packages**.

## Usage

Management of packages is done with PNPM from the **root** folder. Make sure PNPM and Turbo are installed on your system.

## Cloning the Repository

### Cloning with Submodules

To clone the repository along with its required submodules, use the following command:

```bash
git clone --recurse-submodules git@github.com:DANS-KNAW/dans-frontend-framework.git
```

> **Note**: If you're trying to clone a branch that includes a submodule not present in the main branch, make sure to specify the branch using the `-b` flag.

### Cloning Without Submodules

If you've already cloned the repository without the submodules, you can initialize and update them later with the following command:

```bash
git submodule update --init --recursive
```

## Installation

After cloning, run:
```bash
pnpm i
```

## Running the app(s)
```bash
pnpm dev
```

To run just a single app, you can add a line to the package.json scripts section like so:
```json
"dev:ohsmart": "turbo run dev --filter=@dans-framework/ohsmart"
```

Then run `pnpm dev:ohsmart` to start.

Or simply run
```bash
pnpm --filter @dans-framework/ohsmart dev
```

To run this application on a specific port, run
```bash
pnpm --filter @dans-framework/ohsmart dev --port 3000
```

## Testing the app(s)

Front-end testing is done using Playwright. More to follow...

## Building the app(s)

For all apps:
```bash
pnpm build
```

Or for a single app:
```bash
pnpm --filter @dans-framework/ohsmart build
```

## Adding a library to an app/package

Add a library to all apps/packages.
```bash
pnpm i <lib_you_want_to_add>
```

Add the `-D` flag for devDependencies.
To install a library for a single app/package, e.g. @dans-framework/ohsmart, use the `--filter` flag:
```bash
pnpm i <lib_you_want_to_add> --filter '@dans-framework/ohsmart'
```

Alternatively, you can edit the package.json file of the appropriate app or package, and run `pnpm i` again from the root.

### Adding a custom library to your app or package

You can use the `pnpm i` command from above using e.g. `@dans-framework/utils` as package name.
Alternatively, since all packages are referenced locally, edit the dependencies or devDependencies in the package.json file of the app you're working on by adding a line like this:
```json
"@dans-framework/utils": "workspace:*"
```
and then running `pnpm i` again.

## Creating a new app or package

To quickly create a new Vite app, run `pnpm create vite` and follow the prompt.

To create your app in the appropriate folder:

- For a standalone app, use **app/APP_NAME** as project name.
- For a library, use **packages/LIB_NAME** as project name

To ensure naming consistency:

- Use **@dans-framework/NAME** as package name

Alternatively, you can create the appropriate folder structure and package.json manually.

### Configuring build/dev scripts of individual packages

Open up the appropriate package/app folder and edit the **package.json**, **tsconfig.json**, **tsconfig.node.json** and **vite.config.ts** where neccessary.

## Deployment

Deployment is done using Docker containers and a Github Action that listens for changes to folders inside the apps folder. Current pipeline:

1.  Make changes to an app.
2.  The pipeline uses the .env files located in the [IST secrets repo](https://github.com/DANS-KNAW/IST-ohsmart-secrets) when building. So make sure these are up to date.
3.  Create [pull request](pull_request_template.md) for main or demo branch and merge into main or demo. Main is used for the production website, so is only to be updated for tried and tested releases from the demo branch.
4.  After merging the pull request, a fresh Docker image should be created on the [DANS Dockerhub](https://hub.docker.com/u/dansknaw) for each app that's been modified. If not, check Github Actions for errors.
5.  See the [Deployment repo](https://github.com/DANS-KNAW/ohsmart-deploy) for further steps.

## Authentication with Keycloak

This framework has been developed to make use of Keycloak for authentication and storing user data, like target credentials. See the [user-auth package](user-auth.md) for more info.
