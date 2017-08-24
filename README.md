Multiple Database Update
------------------------

With this script you can update (or insert) multiple mongo documents to multiple databases.

## Requirements

- [Node.js (ES6)](https://nodejs.org) >= 8.1.0


## How it works

```
node index.js -h mongodb://localhost:27017 -d _crm -c users -i input.json
```