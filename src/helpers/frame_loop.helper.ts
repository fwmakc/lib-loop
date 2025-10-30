import { wait } from './wait.helper';

/**
 * Starts loop that calls specified callback with updated time and ticks per second.
 * @param {function} callback - Asynchronous function that returns boolean value.
 *                              Loop will continue executing as long as this function returns true.
 * @param {number} [milliseconds=0] - Amount of time to wait between each iteration of loop in milliseconds.
 *                                    If set to 0, no delay will be applied.
 * @returns {Promise<void>} Promise that resolves when loop is exited.
 */
export async function frameLoop(
  callback: (deltaTime: number, tps: number) => Promise<boolean> | boolean,
  milliseconds = 0,
  startLoopMode = 0,
): Promise<void> {
  let infinite = true;
  let lastTime = performance.now();
  let tpsTime = lastTime;
  let tps = 0;
  let frameCount = 0;

  const loop = async () => {
    const currentTime: number = performance.now();
    const deltaTime: number = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    frameCount += 1;

    if (currentTime - tpsTime >= 1000) {
      tps = frameCount;
      frameCount = 0;
      tpsTime = currentTime;
    }

    try {
      infinite = await callback(deltaTime, tps);
    } catch (error) {
      console.error('An error occurred in loop:', error);
      infinite = false;
    }

    if (infinite && milliseconds) {
      await wait(milliseconds);
    }

    if (infinite) {
      requestAnimationFrame(loop);
    }
  };

  if (!startLoopMode) {
    await loop();
  } else {
    requestAnimationFrame(loop);
  }
}
