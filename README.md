# DANS framework monorepo
The DANS framework is a monorepo, using Turbo and PNPM package management and Vite build tools.

## Structure
Apps that are meant to run standalone are lockated in the ./apps folder. Custom libraries that these apps can use are in ./packages.

## Usage
Management of packages is done with PNPM from the **root** folder. Make sure PNPM and Turbo are installed on your system.

#### Installation
Clone the repo and run:

    pnpm i

#### Running the app(s)
`pnpm run dev` to start all apps

To run just a single app, add a line to the package.json scripts section like so:

    "dev:ohsmart": "turbo run dev --filter=@dans-framework/ohsmart"

Then run `pnpm run dev:ohsmart` to start.

#### Testing the app(s)
Tests are not implemented at the moment.

    pnpm run test
    
#### Building the app(s)

    pnpm run build

#### Adding a library to an app/package
 Add a package for all apps/packages. 

     pnpm add <package_name>

Add the `-D` flag for devDependencies.
To install a package for a single app/pack, use the `--filter` flag:

    pnpm i <package_name> --filter '@dans-framework/ohsmart'
Alternatively, you can edit the package.json file of the appropriate package, and run `pnpm -i` again from the root.

#### Creating a new app or package
To quickly create a new Vite app, run `pnpm create vite` and follow the prompt.

To create your app in the appropriate folder:
 - For a standalone app, use **app/APP_NAME** as project name. 
 - For a library, use **packages/LIB_NAME** as project name

 To ensure naming consistency:
 - Use **@dans-framework/NAME** as package name

Alternatively, you can create the appropriate folder structure and package.json manually.

#### Adding a custom library to your app or package
You can use the `pnpm i` command from above using e.g. `@dans-framework/utils` as package name
Alternatively, since all packages are referenced locally, edit the dependencies or devDependencies in the package.json file of the app you're working on by adding a line like this:

    "@dans-framework/utils": "workspace:*"
    
#### Configuring build/dev scripts of individual packages
Open up the appropriate package/app folder and edit the **package.json**, **tsconfig.json**,  **tsconfig.node.json** and **vite.config.ts** where neccessary.
