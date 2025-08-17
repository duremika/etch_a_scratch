import { BUTTONS, SOUNDS } from '../utils/constants.js';

export class EraseButton {
    constructor(scene) {
        this.scene = scene;
        this.sound = scene.sound.get('eraseSound') || scene.sound.add('eraseSound', SOUNDS.ERASE);

        scene.add.circle(
            scene.cameras.main.width + BUTTONS.ERASE.x,
            BUTTONS.ERASE.y,
            50,
            0xffffff,
            0.4
        ).setDepth(4);

        this.button = scene.add.image(
            scene.cameras.main.width + BUTTONS.ERASE.x,
            BUTTONS.ERASE.y,
            'eraseButton'
        )
            .setInteractive({ useHandCursor: true })
            .setDepth(5)
            .setScale(BUTTONS.ERASE.scale)
            .on('pointerdown', this.handleErase.bind(this))
            .on('pointerover', () => this.button.setScale(BUTTONS.ERASE.hoverScale))
            .on('pointerout', () => this.button.setScale(BUTTONS.ERASE.scale));
    }

    handleErase() {
        this.scene.line.clear();
        this.sound.play();
    }

    updatePosition(gameSize) {
        this.button.setPosition(
            gameSize.width + BUTTONS.ERASE.x,
            BUTTONS.ERASE.y
        );
    }
}
