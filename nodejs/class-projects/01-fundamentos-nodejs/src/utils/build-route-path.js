
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replace(routeParametersRegex, (_, key) => `(?<${key}>[a-zA-Z0-9\\-_]+)`)

  const pathRegex = new RegExp(`^${pathWithParams}(?:\\?(?<query>.*))?$`)

  return pathRegex
}