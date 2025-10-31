import { wait } from './wait.helper';

/**
 * Executes callback function repeatedly for specified number of iterations.
 * Optionally, it can introduce delay between consecutive iterations.
 *
 * @param {function} callback - Asynchronous function to invoke on each iteration.
 * @param {number} maxIterations - Maximum number of times to execute callback.
 * @param {number} [milliseconds=0] - Amount of time to wait between each iteration.
 *                                    If set to 0, no delay will be applied.
 * @param {any} [context=null] - Context `this` in which callback should be executed.
 * @returns {Promise<void>} Promise that resolves when all iterations are complete.
 */
export async function iterate(
  callback: () => Promise<void> | void,
  maxIterations: number,
  milliseconds = 0,
  context: any = null,
): Promise<void> {
  let iteration = 0;

  // eslint-disable-next-line no-constant-condition
  while (iteration < maxIterations) {
    await callback.call(context);

    if (milliseconds) {
      await wait(milliseconds);
    }

    iteration++;
  }
}
