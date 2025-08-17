import { BUTTONS, SOUNDS } from '../utils/constants.js';

export class ControlButton {
    constructor(scene, x, y, texture, direction) {
        this.scene = scene;
        this.direction = direction;

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
    }

    handlePointerOut() {
        this.scene.keys[this.direction].isDown = false;
        this.button.setScale(BUTTONS.ARROWS.scale);
    }

    handlePointerUp() {
        this.scene.keys[this.direction].isDown = false;
    }

    handlePointerOver() {
        this.button.setScale(BUTTONS.ARROWS.hoverScale);
    }

    updatePosition(gameSize) {
        this.button.setPosition(
            this.direction === 'left' || this.direction === 'right'
                ? BUTTONS.ARROWS.x
                : gameSize.width - BUTTONS.ARROWS.x,
            this.direction === 'up' || this.direction === 'left'
                ? BUTTONS.ARROWS.y
                : BUTTONS.ARROWS.y + 250,
        );
    }
}
