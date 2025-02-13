/*
$ cd /c/Users/milen/OneDrive/Documentos/GitHub/MarioGame
$ cd mario-game-server
$ export NODE_OPTIONS="--openssl-legacy-provider"
$ npm start
 */


import myplatform from '../img/myplatform.png'
import hills from '../img/hills2.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024 //tag canvas takes up the full width
canvas.height = 576
//create a player with a class named player

const gravity = 0.5
class Player{
    constructor(){
        //propriedades do jogador. Aqui ele vai ser um quadrado
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    //method draw: desenhando o personagem

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}


class Platform{
    constructor({x,y,image}){ // ({ }) é um objeto, não argumentos tipo x,y apenas
        this.position = {
            x,  // = x: x,
            y  // = y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject{
    constructor({x,y,image}){ 
        this.position = {
            x,  // = x: x,
            y  // = y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

let myplatformImage = createImage(myplatform)//como createImage(myplatform) se repete muito, criou-se uma variavel
let platformSmallTallImage = createImage(platformSmallTall)

let player = new Player()
let platforms = []
let genericObject = []

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0 //deslocamento de rolagem

function init() {

    myplatformImage = createImage(myplatform)//como createImage(myplatform) se repete muito, criou-se uma variavel

    player = new Player()
    platforms = [
        new Platform({x: myplatformImage.width * 4 + 300 + myplatformImage.width - platformSmallTallImage.width, y:270, image: platformSmallTallImage}),
        new Platform({x:-1, y:470, image: myplatformImage}), 
        new Platform({x: myplatformImage.width - 0.9, y:470, image: myplatformImage}),
        new Platform({x: myplatformImage.width * 2 + 100, y:470, image: myplatformImage}),
        new Platform({x: myplatformImage.width * 3 + 300, y:470, image: myplatformImage}),
        new Platform({x: myplatformImage.width * 4 + 300, y:470, image: myplatformImage}),
        new Platform({x: myplatformImage.width * 5 + 700, y:470, image: myplatformImage})

    ]

    genericObject = [
        new GenericObject({
            x: -1,
            y: 0,
            image: createImage(background)
        }),
        new GenericObject({
            x: -1,
            y: 0,
            image: createImage(hills)
        })
    ]

    scrollOffset = 0 //deslocamento de rolagem
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height) 

    genericObject.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400){
        player.velocity.x = player.speed
    }else if (
        (keys.left.pressed && player.position.x > 100) || 
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
        ) {
        player.velocity.x = -player.speed
    }else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
            })
            genericObject.forEach(genericObject =>{
                genericObject.position.x -= player.speed * 0.66
            })
        } else if (keys.left.pressed && scrollOffset > 0 /*&& player.position.x > 0*/) {
            scrollOffset -= player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            genericObject.forEach(genericObject =>{
                genericObject.position.x += player.speed * 0.66
            })
        }
    }

    //console.log(scrollOffset)

    //platform collision detection
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y 
        && player.position.y + player.height + player.velocity.y 
        >= platform.position.y && player.position.x + player.width
        >= platform.position.x && player.position.x 
        <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    //win condition
    if (scrollOffset > myplatformImage.width * 5 +300-2) {
        console.log('YOU WIN!')
    }

    //lose condition
    if (player.position.y > canvas.height){
        console.log('YOU LOSE')
        init()
    }
} 

init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 37:
        case 65:
            console.log('left')
            keys.left.pressed = true
            break
        case 40:
        case 83:
            console.log('down')
            break
        case 39:
        case 68:
            console.log('right')
            keys.right.pressed = true
            break
        case 38:
        case 87:
            console.log('up')
            player.velocity.y -= 12
            break
        default:
            console.log('invalid key')
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 37:
        case 65:
            console.log('left')
            keys.left.pressed = false
            break
        case 40:
        case 83:
            console.log('down')
            break
        case 39:
        case 68:
            console.log('right')
            keys.right.pressed = false
            break
        case 38:
        case 87:
            console.log('up')
            break
        default:
            console.log('invalid key')
    }
})