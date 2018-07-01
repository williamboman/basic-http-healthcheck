const http = require('http')
const { URL } = require('url')
const R = require('ramda')

const is2xx = R.both(
    R.gte(R.__, 200),
    R.lte(R.__, 299)
)

const isOKResponse = R.compose(
    is2xx,
    R.prop('statusCode')
)

class Response {
    constructor(response, data) {
        this.statusCode = response.statusCode
        this.body = data
    }
}

class SearchQueryNotFoundError extends Error {}

async function getResponse(url) {
    return new Promise((resolve, reject) => 
        http.request(new URL(url), response => {
            const chunks = []
            response.on('data', chunk => chunks.push(chunk))
            response.on('end', () =>
                R.ifElse(
                    isOKResponse,
                    R.partial(R.unary(resolve), [new Response(response, Buffer.concat(chunks))]),
                    R.partial(R.unary(reject), [new Response(response, null)])
                )(response)
            )
        }).end()
    )
}

async function doHealthCheck({ url, searchQuery }) {
    const response = await getResponse(url)
    if (searchQuery) {
        if (response.body.indexOf(searchQuery) === -1) {
            throw new SearchQueryNotFoundError('Search word does not exist in response body.')
        }
    }
}

exports.SearchQueryNotFoundError = SearchQueryNotFoundError
exports.doHealthCheck = doHealthCheck
