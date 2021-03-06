const redis = require('redis')

class RedisCache {
  constructor(opts) {
    const options = Object.assign({}, opts || {}, {
      host: '127.0.0.1',
      port: 6379,
      keyPrefix: 'kindredAPI-'
    })

    this.client = redis.createClient(options.port, options.host)
    this.client.on('error', function (err) {
      console.log('Redis error:', err)
    })

    process.on('exit', function () {
      console.log('closing')
      this.client.quit()
    })

    this.prefix = options.keyPrefix
  }

  get(args, cb) {
    this.client.get(this.prefix + args.key, (err, reply) => {
      reply ? cb(err, reply) : cb(err)
      return
    })
  }

  set(args, value) {
    this.client.setex(this.prefix + args.key, args.ttl, value)
  }
}

export default RedisCache