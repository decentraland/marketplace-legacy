export function asSafeAction(callback) {
  return async function(...args) {
    try {
      await callback(...args)
    } catch (error) {
      console.error(error)
    } finally {
      process.exit()
    }
  }
}
