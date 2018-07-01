#!/usr/bin/env node

const R = require('ramda')
const { parseArgv } = require('./argv-parser')
const { SearchQueryNotFoundError, doHealthCheck } = require('./')

const args = parseArgv(process.argv, {
    aliases: {
        'f': 'find'
    }
})

const url = args.arguments[0]
const searchQuery = R.propOr(null, 'find', args.options)

if (!url) {
    throw new Error('Missing required URL argument.')
}

async function main() {
    try {
        await doHealthCheck({
            url,
            searchQuery
        })
    } catch (e) {
        if (R.is(SearchQueryNotFoundError, e)) {
            process.stderr.write(`Could not find following search query in response body: ${searchQuery}.\n`)
            return 1
        } else {
            throw e
        }
    }
    return 0
}

main()
    .then(x => process.exit(x || 0))
    .catch(e => (process.stderr.write(`${e}\n`), process.exit(1)))
