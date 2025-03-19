class Placementtile {
    constructor({position = {x:0,y:0},}){
       this.position = position
       this.size = 64
       this.color = 'rgba(255,255,255,0.1)'
       this.occupied = false
            }

    draw(){
       c.fillStyle = this.color
       c.fillRect(this.position.x,this.position.y,this.size,this.size)
    }

    update(mouse){
       this.draw()
       if(mouse.x > this.position.x && mouse.x < this.position.x + this.size && mouse.y > this.position.y && mouse.y < this.position.y + this.size){
          this.color = 'rgba(255,255,255,0.5)'   
        // console.log('colliding')
       }
       else{
          this.color = 'rgba(255,255,255,0.1)'
    }
 }
 }



 class Enemy{
    constructor({position = {x:0,y:0}}){
       this.position = position
       this.height = 100
       this.width = 100
       this.radius = 50
       this.waypointIndex = 0
       this.centre = {x: this.position.x + this.width / 2, y: this.position.y + this.height / 2}
         this.health = 100
         this.velocity = {x:0 , y:0}
    }

    draw(){
       c.fillStyle = 'red'
       //c.fillRect(this.position.x,this.position.y,this.width,this.height)
         c.beginPath()
         c.arc(this.centre.x,this.centre.y,this.radius,0,Math.PI * 2)
         c.fill()

         //healthbar

         c.fillStyle = 'red'
         c.fillRect(this.position.x,this.position.y - 10,this.width,10)

         c.fillStyle = 'green'
         c.fillRect(this.position.x,this.position.y - 10,this.width * this.health /100,10)
    }

    update(){
       this.draw()

       const waypoint = waypoints[this.waypointIndex]
       const dx = waypoint.x - this.centre.x
       const dy = waypoint.y - this.centre.y
       const angle = Math.atan2(dy,dx)
       const speed = 3
       this.velocity.x = Math.cos(angle) * speed
         this.velocity.y = Math.sin(angle) * speed
       this.position.x += this.velocity.x
       this.position.y += this.velocity.y
       this.centre = {x: this.position.x + this.width / 2, y: this.position.y + this.height / 2}

       if(Math.abs(Math.round(this.centre.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
       Math.abs(Math.round(this.centre.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) && this.waypointIndex < waypoints.length - 1){
          this.waypointIndex++
    }
   
 }
 } 

 class Building {
    constructor({position = {x:0,y:0}}){
       this.position = position
       this.width = 64 * 2
         this.height = 64
         this.centre = {x: this.position.x + this.width / 2, y: this.position.y + this.height / 2}
       this.color = 'blue'
       this.projectiles = []
       this.radius = 250
       this.target = null
       this.frames = 0
    }

    draw(){
       c.fillStyle = this.color
       c.fillRect(this.position.x,this.position.y,this.width,this.height)

      //  c.beginPath()
      //    c.arc(this.centre.x,this.centre.y,this.radius,0,Math.PI * 2)
      //    c.fillStyle = 'rgba(230,230,250,0.2)'
      //    c.fill()
    }

    update(){
      this.draw()
      this.frames++
      if(this.frames % 100 === 0 && this.target){
         this.projectiles.push(new Projectile({position: {x: this.centre.x , y: this.centre.y },
         enemy: this.target
      }))
      }

    }
 }

 class Projectile {
    constructor({position = {x:0,y:0} , enemy}){
       this.position = position
       this.velocity = {x:0,y:0}
       this.size = 10
       this.radius = 10
       this.color = 'orange'
       this.enemy = enemy
    }

    draw(){
       c.beginPath()
       c.arc(this.position.x,this.position.y,this.size,0,Math.PI * 2)
       c.fillStyle = this.color
       c.fill()
    }

    update(){
         this.draw()
         const angle = Math.atan2(this.enemy.centre.y - this.position.y, this.enemy.centre.x - this.position.x)
         const speed = 5
         this.velocity.x = Math.cos(angle) * speed
         this.velocity.y = Math.sin(angle) * speed
         this.position.x += this.velocity.x
         this.position.y += this.velocity.y
    }
 }
