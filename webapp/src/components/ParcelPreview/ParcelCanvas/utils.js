/*
  The following code was taken from https://github.com/dy/pan-zoom
  and modified a bit to allow disposing the event listeners
*/

import * as Impetus from 'impetus'
import * as wheel from 'mouse-wheel'
import * as touchPinch from 'touch-pinch'
import * as position from 'touch-position'

export function panzoom(target, cb) {
  if (target instanceof Function) {
    cb = target
    target = document.documentElement || document.body
  }

  //enable panning
  let pos = position.emitter({
    element: target
  })

  let initX = 0
  let initY = 0
  let init = true

  const initListener = e => (init = true)

  target.addEventListener('mousedown', initListener)
  target.addEventListener('touchstart', initListener)

  let lastY = 0
  let lastX = 0
  const impetus = new Impetus({
    source: target,
    update: (x, y) => {
      if (init) {
        init = false
        initX = pos[0]
        initY = pos[1]
      }

      let e = {
        target,
        type: 'mouse',
        dx: x - lastX,
        dy: y - lastY,
        dz: 0,
        x: pos[0],
        y: pos[1],
        x0: initX,
        y0: initY
      }

      lastX = x
      lastY = y
      cb(e)
    },
    multiplier: 1,
    friction: 0.75
  })

  //enable zooming
  const wheelListener = wheel(target, (dx, dy, dz, e) => {
    e.preventDefault()
    cb({
      target,
      type: 'mouse',
      dx: 0,
      dy: 0,
      dz: dy,
      x: pos[0],
      y: pos[1],
      x0: pos[0],
      y0: pos[1]
    })
  })

  //mobile pinch zoom
  let pinch = touchPinch(target)
  let mult = 2
  let initialCoords

  pinch.on('start', curr => {
    let [f1, f2] = pinch.fingers

    initialCoords = [
      f2.position[0] * 0.5 + f1.position[0] * 0.5,
      f2.position[1] * 0.5 + f1.position[1] * 0.5
    ]

    impetus && impetus.pause()
  })
  pinch.on('end', () => {
    if (!initialCoords) return

    initialCoords = null

    impetus && impetus.resume()
  })
  pinch.on('change', (curr, prev) => {
    if (!pinch.pinching || !initialCoords) return

    cb({
      target,
      type: 'touch',
      dx: 0,
      dy: 0,
      dz: -(curr - prev) * mult,
      x: initialCoords[0],
      y: initialCoords[1],
      x0: initialCoords[0],
      y0: initialCoords[0]
    })
  })

  return function dispose() {
    impetus.destroy()
    pos.dispose()
    pinch.removeAllListeners()
    target.removeEventListener('wheel', wheelListener)
    target.removeEventListener('mousedown', initListener)
    target.removeEventListener('touchstart', initListener)
  }
}

import { t } from 'modules/translation/utils'
import { TYPE } from 'shared/asset'
import { isParcel } from 'shared/parcel'
import { shortenAddress } from 'lib/utils'
import { getEstateConnections } from 'modules/estates/utils'

export function getLabel(type, asset, districts) {
  switch (type) {
    case TYPE.loading:
      return t('atlas.loading') + '...'
    case TYPE.district:
    case TYPE.contribution: {
      const district = districts[asset.district_id]
      return district ? district.name : 'District'
    }
    case TYPE.plaza:
      return 'Genesis Plaza'
    case TYPE.roads:
      return t('atlas.road')
    case TYPE.myParcels:
    case TYPE.myParcelsOnSale:
    case TYPE.myEstates:
    case TYPE.myEstatesOnSale:
    case TYPE.taken:
    case TYPE.onSale: {
      return asset.data.name || null
    }
    case TYPE.unowned:
    case TYPE.background:
    default:
      return null
  }
}

export function getDescription(type, asset) {
  switch (type) {
    case TYPE.loading:
    case TYPE.district:
    case TYPE.contribution:
    case TYPE.plaza:
    case TYPE.roads:
      return null
    case TYPE.unowned:
      return t('atlas.no_owner')
    case TYPE.myParcels:
    case TYPE.myParcelsOnSale:
      return t('atlas.your_parcel')
    case TYPE.myEstates:
    case TYPE.myEstatesOnSale:
      return t('atlas.your_estate')
    case TYPE.taken:
    case TYPE.onSale: {
      return t('atlas.owner', { owner: shortenAddress(asset.owner) })
    }
    case TYPE.background:
    default:
      return null
  }
}

export function getTextColor(type) {
  switch (type) {
    case TYPE.loading:
    case TYPE.district:
    case TYPE.contribution:
    case TYPE.roads:
    case TYPE.taken:
    case TYPE.unowned:
    case TYPE.background:
      return 'white'

    case TYPE.myParcels:
    case TYPE.myParcelsOnSale:
    case TYPE.myEstates:
    case TYPE.myEstatesOnSale:
    case TYPE.plaza:
    case TYPE.onSale:
    default:
      return 'black'
  }
}

export function getConnections(x, y, asset) {
  if (!asset) {
    return {
      connectedLeft: false,
      connectedTop: false,
      connectedTopLeft: false
    }
  }

  if (isParcel(asset)) {
    return {
      connectedLeft: !!asset.connectedLeft,
      connectedTop: !!asset.connectedTop,
      connectedTopLeft: !!asset.connectedTopLeft
    }
  }

  return getEstateConnections(x, y, asset)
}
