import log4js from 'log4js'

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    app: { appenders: ['out'], level: 'info' },
    score: { appenders: ['out'], level: 'info' },
  },
})

export function getLogger(category: string) {
  return log4js.getLogger(category)
}
