import { gameConfig } from './config/gameConfig.js';
import { DrawingScene } from './scenes/DrawingScene.js';

class Game extends Phaser.Game {
    constructor(config) {
        super(config);
        this.scene.add('DrawingScene', DrawingScene, true);
    }
}

window.onload = () => {
    new Game(gameConfig);
};
