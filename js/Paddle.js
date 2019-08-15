class Paddle {
  constructor() {
    this.width = 150
    this.height = 25
    this.color = color(255)
    this.location = createVector((width / 2) - (this.width / 2), height - 35)
  }

  display() {
    fill(this.color)
    rect(this.location.x, this.location.y, this.width, this.height)
  }
  update(){
    if(this.location.x <width)
    {
      this.location.x=0;
    }
    else if(this.location.x> width-this.width)
    {
      this.location.x=width-this.width;
    }
  }
}