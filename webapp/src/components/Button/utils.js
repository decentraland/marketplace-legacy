export function buildClassName(baseClassName, type, size) {
  let className = `${baseClassName} Button btn btn-${type}`
  if (size) {
    className = `${className} btn-${size}`
  }
  return className
}
