import kaboom, { big } from "./kaboom.js"

kaboom({
    background: [ 0, 0, 255]
});

const MOVE_SPEED = 200
const JUMP_FORCE = 600
const FALL_DEATH = 400
let isJumping=false

loadRoot('./sprites/')
loadSprite('mario','mario.png')
loadSprite('coin','coin.png')
loadSprite('block','block.png')
loadSprite('pipe','pipe_up.png')
loadSprite('surprise','surprise.png')
loadSprite('unboxed','unboxed.png')
loadSprite('mushroom','mushroom.png')
loadSprite('flag','flag.png')
loadSprite('evil_mushroom','evil_mushroom.png')
loadSound('gameSound','gameSound.mp3')
loadSound('jumpSound','jumpSound.mp3')

scene('start',()=>
{
add([text('Welcome\nPlease press ENTER to start',32),origin('center'),pos(width()/2,height()/2)])
  onKeyDown("enter", () => {
  go("game")
})
})

scene('lose',()=>
{
add([text('GAME OVER\n',32),origin('center'),pos(width()/2,height()/2)])
})


scene("game", () => {
  play("gameSound")
  layers(['bg', 'obj', 'ui'], 'obj')

  const map = [
    '                                                      f    ',
    '                                                           ',
    '                                                           ',
    '                                          =                ',
    '                                                           ',
    '     ?%   !=*=%=?                             ^            ',
    '                                             =             ',
    '                                           =               ',
    '                    ^   ^     x           =                ',
    '==============================   ==========================',
  ]


  const mapSymbols = 
  {
    width: 20,
    height:20,
          '=': () => [sprite('block'), solid(),area()],
          '$': () => [sprite('coin'),area(),"coin"],
          'v': () => [sprite('unboxed'), solid(),area(),"unboxed"],
          's': () => [sprite('surprise'), solid(),area()],
          '?': () => [sprite('surprise'), solid(),area(),"surprise-coin"],
          '!': () => [sprite('surprise'), solid(),area(),"surprise-mushroom"],
          'p': () => [sprite('pipe'), solid(),area()],
          'm': () => [sprite('mushroom'), solid(),area(),"mushroom"],
          '^': () => [sprite('evil_mushroom'), solid(),area(),body(),"evil_mushroom"],
          'f': () => [sprite('flag'),area(),scale(0.3),"flag"]
        }

const gameLevel = addLevel(map,mapSymbols)

  const player = add([
    sprite('mario'), solid(),
    pos(30, 0),//30px far from left - 0px from top
    body(),  // responds to physics and gravity
    origin('bot'),//the origin to draw the object
    area(),
    big()
])


   onKeyDown('right',()=> //keyDown is a Kaboom Function that will be called whenever the 'right' key is pressed 
    {
        player.move(MOVE_SPEED,0) //move right 120 , move down 0
    })

onKeyDown('left',()=>
    {
      player.move(-MOVE_SPEED,0)
})

    onKeyDown('space',()=>
    {
      if(player.grounded())
      {
        play("jumpSound")
        isJumping=true
        player.jump(JUMP_FORCE) //move rig  ht 120 , move down 
      }
    })

player.onHeadbutt((obj)=>
{
  if(obj.is("surprise-coin"))//make sure to use the nick-name and not the orignial
  {
    //spawn  -  loads a new child process.
    //obj.gridPos.sub  -  Returns the subtraction with another vector, so we move the object 0px-right 1px-up
    gameLevel.spawn('$',obj.gridPos.sub(0,1))//
    destroy(obj)//Remove the game obj from scene
    gameLevel.spawn('v',obj.gridPos.sub(0,0))//draw from the same place an unboxed-block
    }
    if(obj.is('surprise-mushroom')) //need to give a nickName
    {
      gameLevel.spawn('m',obj.gridPos.sub(0,1))
      destroy(obj)
      gameLevel.spawn('v',obj.gridPos.sub(0,0))
    } 
})

    player.collides('coin',(x)=>
    {
      destroy(x)
    })

    player.collides('mushroom',(x)=>
    {
      destroy(x)
      player.biggify(6)

    })

   player.action(()=>
   {
    if (player.pos.y >= FALL_DEATH) { //FALL_DEATH = 400
      go("lose")
    }
     if (player.grounded)
     {
       isJumping=false
     }
     else {
       isJumping = true;
     }
      camPos(player.pos)
   })
  
  
    action('mushroom',(x)=>
    {
      x.move(20, 0)
    })
  
  action('evil_mushroom',(x)=>
    {
      x.move(-20,0)
    })
  
  player.collides("flag", (x) =>
  {
    player.pos.x += 10
    player.pos.y = 180;  
  })
  
  player.collides('evil_mushroom',(x)=>
    {
      if(isJumping)
      {
        destroy(x)
      }
      else
      {
        shake(120)
        wait(1, () => {
          go('lose')
      })
        
      }
    })
 
})


go("start") //start the scene called game