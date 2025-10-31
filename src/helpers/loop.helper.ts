import { wait } from './wait.helper';

/**
 * Executes given asynchronous callback function in loop until callback returns false.
 * loop can include optional pause between iterations.
 *
 * @param {function} callback - Asynchronous function that returns boolean value.
 *                              Loop will executing while function returns true.
 * @param {number} [milliseconds=0] - Amount of time to wait between each iteration.
 *                                    If set to 0, no delay will be applied.
 * @param {number} [tps=0] - Ticks per second. Loop will attempt to maintain this rate.
 * @param {any} [context=null] - Context `this` in which callback should be executed.
 * @returns {Promise<void>} Promise that resolves when loop is exited.
 */
export async function loop(
  callback: (deltaTime: number) => Promise<boolean> | boolean,
  milliseconds = 0,
  tps = 0,
  context: any = null,
): Promise<void> {
  const tpsInterval = tps ? 1000 / Math.abs(tps) : 0;

  let infinite = true;
  let lastTime = performance.now() - tpsInterval;
  let waitingTime = 0;

  // eslint-disable-next-line no-constant-condition
  while (infinite) {
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

    if (tpsInterval) {
      const thisTime = performance.now();
      const remainingTime =
        tpsInterval - waitingTime - (thisTime - currentTime);
      if (remainingTime > 0) {
        await wait(remainingTime);
      }
      waitingTime = performance.now() - thisTime - remainingTime;
    }
  }
}
