# RDT Search UI

## Usage

### Installing Packages

First, install the required packages by running the following command:

```bash
npm install
```

### Local Development

For local development, you can start the development server by running:

```bash
npm run watch
```

### Production Build

If you only need to generate the production build, use:

```bash
npm run build
```

## Integrating with Other Projects

### As a Git Submodule

If the parent project specifies this repository as a submodule, you can clone both simultaneously using:

```bash
git clone --recursive https://github.com/YOURREPO
```

### Without Using as a Submodule

If you prefer not to use this as a submodule, navigate to the directory where you want to install the package. Then run:

```bash
npm install
npm run build
```

## TODO

- move facet values to Facet classes. This way we can finegrain the way the values are handled, for example after a reset when the ListFacet values have been set to 'show all', we want to show all the values instead of the initial config.size amount.
- move handling of list facet values to list facet class?
- add full text value to active filters (with full text it is just says: 'clear all' now)
