import { wait } from './wait.helper';

/**
 * Executes given asynchronous callback function in loop until callback returns false.
 * loop can include optional pause between iterations.
 *
 * @param {function} callback - Asynchronous function that returns boolean value.
 *                              Loop will continue executing as long as this function returns true.
 * @param {number} [milliseconds=0] - Amount of time to wait between each iteration of loop in milliseconds.
 *                                    If set to 0, no delay will be applied.
 * @returns {Promise<void>} Promise that resolves when loop is exited.
 */
export async function loop(
  callback: (
    deltaTime: number,
    tps: number,
    fps: number,
  ) => Promise<boolean> | boolean,
  milliseconds = 0,
  tpsCustom: number | null = null, // Новый параметр для жесткой установки TPS
  context: any = null,
): Promise<void> {
  let infinite = true;
  let lastTime = performance.now();
  let tpsTime = lastTime;
  let tps = 0;
  let fps = 0;
  let frameCount = 0;

  const tpsInterval =
    tpsCustom !== null ? 1000 / (tpsCustom > 0 ? tpsCustom : 1) : null;

  // eslint-disable-next-line no-constant-condition
  while (infinite) {
    const currentTime: number = performance.now();
    const deltaTime: number = (currentTime - lastTime) / 1000;

    lastTime = currentTime;
    frameCount += 1;

    if (currentTime - tpsTime >= 1000) {
      tps = frameCount;
      fps = Math.round(1000 / deltaTime);
      frameCount = 0;
      tpsTime = currentTime;
    }

    try {
      infinite = await callback.call(context, deltaTime, tps, fps);
    } catch (error) {
      console.error('An error occurred in loop:', error);
      infinite = false;
    }

    if (infinite && milliseconds) {
      await wait(milliseconds);
    }

    if (tpsInterval) {
      const elapsedTime = performance.now() - currentTime;
      const remainingTime = tpsInterval - elapsedTime;

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    }
  }
}
