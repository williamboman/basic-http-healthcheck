const R = require('ramda')

const getArgs = R.slice(2, Infinity)

const isCommentArgTuple = R.compose(
    R.test(/^--?\w+[\w-]*/i),
    R.head
)

const renameKeys = R.curry((keysMap, obj) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
)

const splitIntoArgTuple = R.splitEvery(2)

const removeCommentHyphens = R.dropWhile(R.equals('-'))

const getOptionsFromArgv = (argv, aliases) =>
    R.compose(
        renameKeys(aliases),
        R.fromPairs,
        R.map(R.over(R.lensIndex(0), removeCommentHyphens)),
        R.takeWhile(isCommentArgTuple),
        splitIntoArgTuple,
        getArgs
    )(argv)


const getArgumentsFromArgv = R.compose(
    R.flatten,
    R.dropWhile(isCommentArgTuple),
    splitIntoArgTuple,
    getArgs
)

function parseArgv(argv, { aliases = {} } = {}) {
    return {
        options: getOptionsFromArgv(argv, aliases),
        arguments: getArgumentsFromArgv(argv)
    }
}

exports.parseArgv = parseArgv
