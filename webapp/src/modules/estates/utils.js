import { buildCoordinate } from 'shared/parcel'

export const getEstateConnections = (x, y, estate) => {
  const leftId = buildCoordinate(x - 1, y)
  const topId = buildCoordinate(x, y + 1)
  const topLeftId = buildCoordinate(x - 1, y + 1)

  const connectedLeft = estate.parcels.some(
    p => buildCoordinate(p.x, p.y) === leftId
  )
  const connectedTop = estate.parcels.some(
    p => buildCoordinate(p.x, p.y) === topId
  )
  const connectedTopLeft = estate.parcels.some(
    p => buildCoordinate(p.x, p.y) === topLeftId
  )

  return { connectedLeft, connectedTop, connectedTopLeft }
}

export function getEstateIdFromTxReceipt({ logs }) {
  const createEstateLog = logs.find(log => log.name === 'CreateEstate')
  const estateIdArg = createEstateLog.events.find(
    args => args.name === '_estateId'
  )
  return estateIdArg.value
}
