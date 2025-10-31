/**
 * Pauses execution for specified amount of time.
 *
 * @param {number} milliseconds - Amount of time to wait in milliseconds.
 * @returns {Promise<void>} Promise that resolves after specified time has passed.
 */
export async function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
}
