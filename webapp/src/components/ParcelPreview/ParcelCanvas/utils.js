/*
  The following code was taken from https://github.com/dy/pan-zoom
  and modified a bit to allow disposing the event listeners
*/

import * as Impetus from 'impetus'
import * as wheel from 'mouse-wheel'
import * as touchPinch from 'touch-pinch'
import * as position from 'touch-position'
import { t } from 'modules/translation/utils'
import { TYPES } from 'shared/asset'
import { shortenAddress } from 'lib/utils'

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

export function getLabel(type, asset, districts) {
  switch (type) {
    case TYPES.loading:
      return t('atlas.loading') + '...'
    case TYPES.district:
    case TYPES.contribution: {
      const district = districts[asset.district_id]
      return district ? district.name : 'District'
    }
    case TYPES.plaza:
      return 'Genesis Plaza'
    case TYPES.roads:
      return t('atlas.road')
    case TYPES.myParcels:
    case TYPES.myParcelsOnSale:
    case TYPES.myEstates:
    case TYPES.myEstatesOnSale:
    case TYPES.taken:
    case TYPES.onSale: {
      return asset.data.name || null
    }
    case TYPES.unowned:
    case TYPES.background:
    default:
      return null
  }
}

export function getDescription(type, asset) {
  switch (type) {
    case TYPES.loading:
    case TYPES.district:
    case TYPES.contribution:
    case TYPES.plaza:
    case TYPES.roads:
      return null
    case TYPES.unowned:
      return t('atlas.no_owner')
    case TYPES.myParcels:
    case TYPES.myParcelsOnSale:
      return t('atlas.your_parcel')
    case TYPES.myEstates:
    case TYPES.myEstatesOnSale:
      return t('atlas.your_estate')
    case TYPES.taken:
    case TYPES.onSale: {
      return t('atlas.owner', { owner: shortenAddress(asset.owner) })
    }
    case TYPES.background:
    default:
      return null
  }
}

export function getTextColor(type) {
  switch (type) {
    case TYPES.loading:
    case TYPES.district:
    case TYPES.contribution:
    case TYPES.roads:
    case TYPES.taken:
    case TYPES.unowned:
    case TYPES.background:
      return 'white'

    case TYPES.myParcels:
    case TYPES.myParcelsOnSale:
    case TYPES.myEstates:
    case TYPES.myEstatesOnSale:
    case TYPES.plaza:
    case TYPES.onSale:
    default:
      return 'black'
  }
}

export function getConnections(asset) {
  return {
    connectedLeft: !!(asset && asset.connectedLeft),
    connectedTop: !!(asset && asset.connectedTop),
    connectedTopLeft: !!(asset && asset.connectedTopLeft)
  }
}
