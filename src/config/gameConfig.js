export const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1420,
    height: 1100,
    backgroundColor: '#000000',
    input: {
        keyboard: true,
        gamepad: true,
        touch: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        resizeInterval: 100
    }
};
