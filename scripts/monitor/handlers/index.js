// Check the default file search progression on './HandlerIndex#get'

import { eth, txUtils, contracts } from 'decentraland-commons'
import { decodeAssetId, debounceById } from './utils'
import { Parcel } from '../../../src/Parcel'
import { Publication } from '../../../src/Publication'

export async function transform_Marketplace(event) {
  if (event.removed) return

  const { transactionHash } = event
  const { assetId } = event.args
  const id = await decodeAssetId(assetId)

  switch (event.event) {
    case 'AuctionCreated': {
      const { creator, priceInWei, expiresAt } = event.args
      const [x, y] = Parcel.splitId(id)

      console.log(
        `[Marketplace-AuctionCreated] Creating publication for ${x} ${y}`
      )

      await Publication.insert({
        tx_hash: transactionHash,
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: Publication.STATUS.open,
        owner: creator.toLowerCase(),
        buyer: null,
        price: eth.utils.fromWei(priceInWei.toNumber()),
        expires_at: new Date(expiresAt),
        x,
        y
      })
      break
    }
    case 'AuctionSuccessfull': {
      const { totalPrice, winner } = event.args

      console.log(
        `[Marketplace-AuctionSuccessfull] Publication ${id} sold to ${winner}`
      )

      await Publication.update(
        {
          status: Publication.STATUS.sold,
          buyer: winner.toLowerCase(),
          price: eth.utils.fromWei(totalPrice.toNumber())
        },
        { id }
      )
      await Parcel.update({ owner: winner }, { id })
      break
    }
    case 'AuctionCancelled': {
      console.log(`[Marketplace-AuctionCancelled] Publication ${id} cancelled`)

      await Publication.update({ status: Publication.STATUS.cancelled }, { id })
      break
    }
    default:
      break
  }

  return event
}

export async function transform_LANDRegistry(event) {
  if (event.removed) return

  const { assetId } = event.args
  const id = await decodeAssetId(assetId)

  switch (event.event) {
    case 'Update': {
      try {
        const { data } = event.args
        const attributes = { data: contracts.LANDRegistry.decodeLandData(data) }

        debounceById(id, () => {
          const attrsStr = JSON.stringify(attributes)
          console.log(`[LANDRegistry-Update] Updating "${id}" with ${attrsStr}`)

          Parcel.update(attributes, { id })
        })
      } catch (error) {
        // Skip badly formed data
      }
      break
    }
    case 'Transfer': {
      const { to } = event.args

      debounceById(id, () => {
        console.log(
          `[LANDRegistry-Transfer] Updating "${id}" owner with "${to}"`
        )
        Parcel.update({ owner: to.toLowerCase() }, { id })
      })
      break
    }
    default:
      break
  }

  return event
}

export * from './HandlersIndex'
