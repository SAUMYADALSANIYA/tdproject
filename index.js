const canvas = document.querySelector('canvas')
 const c = canvas.getContext('2d')
 canvas.width = 1280
 canvas.height = 768
 c.fillStyle = 'white'
 c.fillRect(0,0,canvas.width,canvas.height)
 console.log(canvas)   
const placementTilesData2D = []
for(let i =0 ; i< placementTilesData.length ;i+=20){
   placementTilesData2D.push(placementTilesData.slice(i,i+20))
}

   

   const placementTiles = []
   for(let y = 0; y < placementTilesData2D.length; y++){
      for(let x = 0; x < placementTilesData2D[y].length; x++){
         if(placementTilesData2D[y][x] === 14){
            placementTiles.push(new Placementtile({position: {x: x * 64, y: y * 64}}))
         }
      }
   }
   


 const image = new Image()
 image.src = 'img/tdmap.png'
 

  
   const enemies = []
  
   function spawnEnemy(spawnCount){
      for(let i = 1; i < spawnCount +1; i++){
         const xOffSet = i*150
         enemies.push(new Enemy({position: {x: waypoints[0].x - xOffSet, y: waypoints[0].y}}))
      }
   }
   
   
   image.onload = () => {
    
      animate()
   }

   const buildings = []
   let activeTile = null
   let enemyCount = 3
   let hearts = 10
   spawnEnemy(enemyCount)

    function animate(){
     const animationId = requestAnimationFrame(animate)
    c.drawImage(image,0,0)
    for (let i = enemies.length - 1; i >= 0; i--){
     const enemy = enemies[i]
       enemy.update()

         if(enemy.position.x > canvas.width){
            enemies.splice(i,1)
            hearts--

            if(hearts === 0){
               cancelAnimationFrame(animationId)
               console.log('game over')
               document.querySelector('#gameOver') .style.display = 'flex'
         }

        
   }

    placementTiles.forEach(tile => tile.update(mouse))

      buildings.forEach((building) => {
         building.update()
         building.target = null
         const validTargets = enemies.filter(enemy => {
            const xDifference = enemy.centre.x - building.centre.x
            const yDifference = enemy.centre.y - building.centre.y
            const distance = Math.hypot(xDifference, yDifference)
            return distance < enemy.radius + building.radius
         })
         building.target = validTargets[0]

         for (let i = building.projectiles.length - 1; i >= 0; i--){
            const projectile = building.projectiles[i]
         
               projectile.update()
            const xDifference = projectile.enemy.centre.x - projectile.position.x
         const yDifference = projectile.enemy.centre.y - projectile.position.y
         const distance = Math.hypot(xDifference, yDifference)
         if (distance < projectile.enemy.radius + projectile.radius){
            building.projectiles.splice(i,1)
            projectile.enemy.health -= 20
            if(projectile.enemy.health <= 0){
               const enemyIndex = enemies.findIndex((enemy) => {
                  return enemy === projectile.enemy
               })
               if(enemyIndex > -1){
               enemies.splice(enemyIndex,1)
               }

               if(enemies.length === 0){
                  enemyCount += 2
                  spawnEnemy(enemyCount)
               }

            }

         }

         console.log(distance)

         }

         
      })
    
   }
 }

   const mouse = {
      x: undefined,
      y: undefined
   }

   canvas.addEventListener('click', () => {
      if(activeTile && !activeTile.occupied){
         activeTile.occupied = true
         buildings.push(new Building({position: {x: activeTile.position.x, y: activeTile.position.y}}))
      }
   })
 window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    activeTile = null
      for(let i =0; i< placementTiles.length; i++){
         const tile = placementTiles[i]
         if(mouse.x > tile.position.x &&
             mouse.x < tile.position.x + tile.size &&
              mouse.y > tile.position.y &&
               mouse.y < tile.position.y + tile.size
            ){
            activeTile = tile
            break
         }
      }
      
 }
)
