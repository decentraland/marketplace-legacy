let auxCanvas
function getAuxCanvas() {
  if (auxCanvas) {
    return auxCanvas
  }
}

function drawOutterBorder(width, style, where) {
  //  clear the workspace
  workCtx.ctx.globalCompositeOperation = 'source-over'
  workCtx.ctx.clearRect(0, 0, workCtx.width, workCtx.height)

  // set the width to double
  workCtx.ctx.lineWidth = width * 2
  workCtx.ctx.strokeStyle = style

  // fill colour does not matter here as its not seen
  workCtx.ctx.fillStyle = 'white'

  // can use any join type
  workCtx.ctx.lineJoin = 'round'

  // draw the shape outline at double width
  strokeShape(workCtx.ctx)

  // set comp to in.
  // in means leave only pixel that are both in the source and destination
  if (where.toLowerCase() === 'in') {
    workCtx.ctx.globalCompositeOperation = 'destination-in'
  } else {
    // out means only pixels on the destination that are not part of the source
    workCtx.ctx.globalCompositeOperation = 'destination-out'
  }
  fillShape(workCtx.ctx)
  ctx.drawImage(workCtx, 0, 0)
}

export const Selection = {
  draw({
    ctx,
    x,
    y,
    selection = [],
    scale = 1.2,
    size = 10,
    fill = '#ff9990',
    stroke = '#ff4130',
    width = 1
  }) {
    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    ctx.strokeWidth = width
    ctx.beginPath()
    selection.forEach(({ x, y }) => {
      ctx.rect(
        x - size / 2 * scale,
        y - size / 2 * scale,
        size * scale,
        size * scale
      )
    })
    ctx.shadowBlur = 2 * scale
    ctx.shadowColor = stroke
    ctx.fill()
    ctx.closePath()
    ctx.shadowBlur = 0
  }
}
