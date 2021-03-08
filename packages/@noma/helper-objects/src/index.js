import { createDebug } from '@noma/helper-debug'

const debug = createDebug()

export function replaceValues (value, replacer) {
  debug('replaceValues(%O, %O)', value, replacer)

  if (isString(value) || isNumber(value) || isBoolean(value) || isDate(value)) {
    return replacer(value)
  }

  if (isObject(value)) {
    for (const prop in value) {
      value[prop] = replaceValues(value[prop], replacer)
    }
  } else if (isArray(value)) {
    for (const prop of value) {
      value[prop] = replaceValues(value[prop], replacer)
    }
  }

  return value
}

export function interpolateString (str, vars) {
  debug('interpolateString("%s", %O)', str, vars)

  return Object.keys(vars).reduce((str, key) => {
    const value = vars[key]
    const regex = new RegExp(`\\\${env\\.${key}}`, 'gm')

    return str.replace(regex, value)
  }, str)
}

export function isObject (value) {
  debug('isObject(%O)', value)

  return typeof value === 'object' && value !== null
}

export function isArray (value) {
  debug('isArray(%O)', value)

  return Array.isArray(value)
}

export function isNumber (value) {
  debug('isNumber(%O)', value)

  return typeof value === 'number'
}

export function isString (value) {
  debug('isString(%O)', value)

  return typeof value === 'string'
}

export function isBoolean (value) {
  debug('isBoolean(%O)', value)

  return typeof value === 'boolean'
}

export function isDate (value) {
  debug('isDate(%O)', value)

  return value instanceof Date
}

export function mergeObjects (...objects) {
  debug('mergeObjects(%O)', objects)

  return objects.reduce((target, source) => {
    const output = Object.assign({}, target)

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] })
          } else {
            output[key] = mergeObjects(target[key], source[key])
          }
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }

    return output
  }, {})
}
