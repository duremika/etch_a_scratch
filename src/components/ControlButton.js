import { BUTTONS, SOUNDS } from '../utils/constants.js';

export class ControlButton {
    constructor(scene, x, y, texture, direction) {
        this.scene = scene;
        this.direction = direction;
        this.sound = scene.sound.get('moveSound') || scene.sound.add('moveSound', SOUNDS.MOVE);

        this.button = scene.add.image(x, y, texture)
            .setInteractive({ useHandCursor: true })
            .setDepth(5)
            .setScale(BUTTONS.ARROWS.scale)
            .on('pointerdown', this.handlePointerDown.bind(this))
            .on('pointerout', this.handlePointerOut.bind(this))
            .on('pointerup', this.handlePointerUp.bind(this))
            .on('pointerover', this.handlePointerOver.bind(this));
    }

    handlePointerDown() {
        this.scene.keys[this.direction].isDown = true;
        this.sound.play();
    }

    handlePointerOut() {
        this.scene.keys[this.direction].isDown = false;
        this.sound.stop();
        this.button.setScale(BUTTONS.ARROWS.scale);
    }

    handlePointerUp() {
        this.scene.keys[this.direction].isDown = false;
        this.sound.stop();
    }

    handlePointerOver() {
        this.button.setScale(BUTTONS.ARROWS.hoverScale);
    }

    updatePosition(gameSize) {
        this.button.setPosition(
            this.direction === 'left' || this.direction === 'right'
                ? BUTTONS.ARROWS.x
                : gameSize.width + BUTTONS.ERASE.x,
            this.direction === 'up' ? BUTTONS.ARROWS.y : BUTTONS.ARROWS.y + 250
        );
    }
}
