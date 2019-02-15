const ufoImageUrl = "https://images2.imgbox.com/90/61/bP8foIzS_o.png";
const bullitImageUrl = "https://images2.imgbox.com/6b/32/GELVjZiO_o.png";
const rocketImageUrl = "https://images2.imgbox.com/a9/ee/3de7UGDe_o.png";

class Ufo extends BouncingSprite {
    constructor(x, y, xSpeed, ySpeed) {
        super(ufoImageUrl, x, y, xSpeed, ySpeed);

        // met een CSS-filter kunnen we deze versie een andere kleur geven
        this.element.style.filter = `hue-rotate( ${Math.random() * 360}deg )`;
    }
}


let player; // Deze variabele moet globaal zijn. Waarom? anders kan de rest van het spel niet bijhouden of het een speler is of niet


function createGameSprites() {
    const allUfos = [
        [350, 225, 1, 2],
        [350, 225, -2, 1],
        [350, 225, 2, -1],
        [350, 225, -1, -2],
        [350, 225, 2, 1],
        [350, 225, -1, 2],
        [350, 225, 1, -2],
        [350, 225, -2, -1]
    ].map(ufoData => new Ufo(...ufoData));
    // de variabele "allUfos" bevat nu een lijst met instanties
    // van de Ufo-klasse, maar met die lijsten hoeven we niets
    // te doen, want de Sprite-klasse houdt nu ook zelf een lijst
    // bij, en gebruikt die lijst om alle Sprites periodiek een
    // update() te laten doen.

    player = new Player(60, 400, 0, 0);
}

class Bullit extends CollidingSprite {
    constructor(x, y) {
        super(bullitImageUrl, x, y, 0, -8);
    }

    update() {
        super.update();
        if (this.y > Sprite.gameHeight) {
            this.remove();
        }
    }

    isCollision(otherSprite) {
        return (
            this.x >= otherSprite.x &&
            this.x <= otherSprite.x + otherSprite.width &&
            this.y >= otherSprite.y &&
            this.y <= otherSprite.y + otherSprite.height
        );
    }

    handleCollisionWith(otherSprite) {
        otherSprite.remove();
        this.remove();
    }
}

class Player extends Sprite {
    constructor(x, y, xSpeed, ySpeed) {
        super(rocketImageUrl, x, y, xSpeed, ySpeed);
        installKeyboardHandler();
    }

    moveToRight() {
        if (this.x < Sprite.gameWidth - this.width) {
            this.xSpeed = 3;
        }
    }

    moveToLeft() {
        if (this.x > 0) {
            this.xSpeed = -3;
        }
    }

    update() {
        super.update();
        if (this.x <= 0 || this.x >= Sprite.gameWidth - this.width) {
            this.xSpeed = 0;
        }
    }
}

let teller = 0;

function installKeyboardHandler() {
    // Het "keydown" event kan je gebruiken om alle toetsaanslagen
    // te detecteren, ook van pijltjestoetsen, functietoetsen, shift, ctrl
    // etc.
    // `event.code` zal dan een string bevatten die de ingedrukte toets
    // beschijft. Gebruik http://keycode.info/ om achter de codenamen van
    // toetsen te komen.
    document.addEventListener("keydown", event => {
        if (event.code == "Space") {
            // normaal zal een browser de pagina scrollen als je op de spatiebalk
            // drukt. preventDefault() voorkomt dat.
            event.preventDefault();
            if(teller / 2  === 1){
                teller = 0;
                console.log("IK SCHIET");
                new Bullit(player.x + 18, 400);
            }
            teller++;
        }

        if (event.code == "ArrowLeft") {
            player.moveToLeft();
            console.log("IK GA NAAR LINKS");
        }
        if (event.code == "ArrowRight") {
            player.moveToRight();
            console.log("IK GA NAAR RECHTS");
        }
    });
}

const startButton = document.getElementById("startButton");
const titleImg = document.getElementById("titleImage");
const animationDiv = document.getElementById("animationDiv");

startButton.addEventListener("click", () => {
    animationDiv.removeChild(startButton);
    animationDiv.removeChild(titleImage);

    createGameSprites();
    Sprite.startEngine();
    installKeyboardHandler();
});
