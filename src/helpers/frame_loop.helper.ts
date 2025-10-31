import { frameRate } from './frame_rate.helper';
import { wait } from './wait.helper';

/**
 * Starts loop that calls specified callback with updated time and ticks per second.
 *
 * @param {function} callback - Asynchronous function that returns boolean value.
 *                              Loop will executing while function returns true.
 * @param {number} [milliseconds=0] - Amount of time to wait between each iteration.
 *                                    If set to 0, no delay will be applied.
 * @param {any} [context=null] - Context `this` in which callback should be executed.
 * @returns {Promise<void>} Promise that resolves when loop is exited.
 */
export async function frameLoop(
  callback: (deltaTime: number) => Promise<boolean> | boolean,
  milliseconds = 0,
  context: any = null,
): Promise<void> {
  const frameRateMs = await frameRate();
  return new Promise((resolve) => {
    let infinite = true;
    let lastTime = performance.now() - frameRateMs;

    const loop = async () => {
      const currentTime: number = performance.now();
      const deltaTime: number = (currentTime - lastTime) / 1000;

      lastTime = currentTime;

      try {
        infinite = await callback.call(context, deltaTime);
      } catch (error) {
        console.error('An error occurred in loop:', error);
        infinite = false;
      }

      if (infinite && milliseconds) {
        await wait(milliseconds);
      }

      if (infinite) {
        requestAnimationFrame(loop);
      } else {
        resolve();
      }
    };

    loop();
  });
}
