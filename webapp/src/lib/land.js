export const ONE_LAND_IN_MANA = 1000

export default {
  ONE_LAND_IN_MANA,

  convert(amount, unit = 'land') {
    if (amount <= 0) return 0

    let result = null

    switch (unit.toLowerCase()) {
      case 'land':
        result = amount
        break
      case 'mana':
        result = amount * ONE_LAND_IN_MANA
        break
      default:
        throw new Error(
          'Unrecognized unit, the supported values are `land` or `mana`'
        )
    }

    return result
  }
}
