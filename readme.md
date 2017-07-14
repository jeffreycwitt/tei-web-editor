# TEI WEB EDITOR With Github integration

## Installation

1. `npm install`

Create file called github.json with the following config credentials

```json
{
"redirect": "http://localhost:4567",
"url": "http://localhost:4567",
"scope": "repo user",
"client": "<ClientID>",
"secret": "<CLIENT SECRET"
}
```

Make sure this file stays outside of your git history!

2. `webpack`

3. `node server.js`

## Contributors

* Jeffrey C. Witt (Loyola University Maryland)
* Rashmi Singhal (Harvard University)
