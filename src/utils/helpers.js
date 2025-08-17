import { ORIGINAL_SIZE, DRAWING_AREA } from './constants.js';
export function calculateDrawingArea(scene) {
    const scaleX = scene.cameras.main.width / ORIGINAL_SIZE.WIDTH;
    const scaleY = scene.cameras.main.height / ORIGINAL_SIZE.HEIGHT;

    return {
        x: DRAWING_AREA.x * scaleX,
        y: DRAWING_AREA.y * scaleY,
        width: DRAWING_AREA.width * scaleX,
        height: DRAWING_AREA.height * scaleY
    };
}
