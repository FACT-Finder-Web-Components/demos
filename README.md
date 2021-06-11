# FACT-Finder Web Components Demos

These demos showcase the usage of FACT-Finder Web Components.
You will also find several special use cases with a custom implementation.

## Installation

1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install` from your command line

## Running demos

Open your command line tool at the demos' root directory and run

```shell
node start.js <directory> [<file>]
```

- `<directory>` is the directory of the demo you want to start, e.g. `ff-record-list`
- `[<file>]` is an optional parameter that specifies the file that shall be loaded.
  For example `load-more.html`.
  If you don't specify it, it defaults to `index.html`.

Example calls:

```shell
node start.js ff-record-list  # opens /ff-record-list/index.html

node start.js ff-record-list load-more.html  # opens /ff-record-list/load-more.html
```

### Trouble Shooting

If you encounter `Error: listen EADDRINUSE: address already in use :::9999`, port `9999` is already being used.
`9999` is the default port used by the demo starting script.
You can change it in the file `./port.js` to fit your system.
