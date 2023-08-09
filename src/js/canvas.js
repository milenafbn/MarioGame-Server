import myplatform from '../img/myplatform.png';
console.log(myplatform)

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024 //tag canvas takes up the full width
canvas.height = 576
//create a player with a class named player

const gravity = 0.5
class Player{
    constructor(){
        //propriedades do jogador. Aqui ele vai ser um quadrado
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
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
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

const image = new Image()
image.src = myplatform

console.log(image)

const player = new Player()
const platforms = [new Platform({x:-1, y:470, image}), 
  new Platform({x: image.width - 0.9, y:470, image})]


const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0 //deslocamento de rolagem

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height) //limpa toda a tela
    
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()
    if (keys.right.pressed && player.position.x < 400){
        player.velocity.x = 5
    }else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    }else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach((platform) => {
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach((platform) => {
                platform.position.x += 5
            })
        }
    }

    //console.log(scrollOffset)

    //platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y 
        && player.position.y + player.height + player.velocity.y 
        >= platform.position.y && player.position.x + player.width
        >= platform.position.x && player.position.x 
        <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    if (scrollOffset > 2000) {
        console.log('YOU WIN!')
    }
}           

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
            player.velocity.y -= 1
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
            player.velocity.y -= 20
            break
        default:
            console.log('invalid key')
    }
})