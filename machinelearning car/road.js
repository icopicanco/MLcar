class Road{
  constructor(x,w,lcount=3){
    this.x=x;
    this.width=w
    this.laneCount=lcount

    this.left=x-w/2
    this.right=x+w/2
    const infinity =999999
    this.top = infinity;
    this.bottom = -infinity;
    const topLeft = {y:this.top,x:this.left}
    const bottomLeft = {y:this.bottom,x:this.left}
    const topRight = {y:this.top,x:this.right}
    const bottomRight = {y:this.bottom,x:this.right}

    this.borders = [[topLeft,bottomLeft],[topRight,bottomRight]]
  }
  getLaneCenter(laneIndex){
    const laneWidth=this.width/this.laneCount;
    return this.left+laneWidth/2+laneIndex*laneWidth;
  }
  draw(ctx){
  ctx.lineWidth = 5;
  ctx.strokeStyle = "yellow";

  for(let i=1;i<=this.laneCount-1;i++){

    const x = lerp(this.left,this.right,i/this.laneCount)
    ctx.setLineDash([20,15])
    ctx.beginPath()
    ctx.moveTo(x,this.bottom)
    ctx.lineTo(x, this.top)
    ctx.stroke()
  }
  ctx.setLineDash([])
  this.borders.forEach(border => {
      ctx.beginPath()
      ctx.moveTo(border[0].x,border[0].y)
      ctx.lineTo(border[1].x,border[1].y)
      ctx.stroke()
  });

  }
}
