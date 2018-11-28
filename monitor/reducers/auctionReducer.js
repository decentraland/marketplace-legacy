import { eth } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Asset'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'

const log = new Log('auctionReducer')

export async function auctionReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.LANDAuction: {
      await reduceAuction(event)
      break
    }
    default:
      break
  }
}

async function reduceAuction(event) {
  const { name, block_number } = event

  switch (name) {
    case eventNames.BidSuccessful: {
      const { _price, _beneficiary, _xs, _ys } = event.args
      const timestamp = await new BlockTimestampService().getBlockTime(
        block_number
      )
      const xs = _xs.split(',')
      const ys = _ys.split(',')
      const ids = xs.map((x, index) => Parcel.buildId(x, ys[index]))
      const price = eth.utils.fromWei(_price).toFixed(2)

      log.info(
        `[${name}] Updating auction data for "${ids}" with ${price},${_beneficiary},${timestamp}`
      )
      await Parcel.updateAuctionData(price, _beneficiary, timestamp, ids)
      break
    }
    default:
      break
  }
}
