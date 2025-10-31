import { wait } from '../helpers/wait.helper';

/**
 * Class that allows for infinite execution loop,
 * executing specified main function repeatedly until stopped.
 * It supports optional callbacks before starting, stopping,
 * or moving to next iteration.
 *
 * @class
 */
export class Infinite {
  private i = -1;

  private infinite = false;

  private main: (args: Infinite) => Promise<void> | void = () => {};

  /**
   * Creates instance of Infinite class.
   *
   * @param {(args: Infinite) => Promise<void> | void} main -
   * Main function to be executed in each iteration. This function can be
   * synchronous or return Promise that resolves when operation is complete.
   */
  constructor(main: (args: Infinite) => Promise<void> | void) {
    this.main = main;
  }

  /**
   * Current iteration count.
   *
   * @returns {number} Current iteration count.
   */
  get iterate() {
    return this.i;
  }

  /**
   * Setter for iterate property.
   * This is intentionally left as no-op.
   *
   * @param {number} value - Value to be set.
   */
  set iterate(value) {
    return;
  }

  /**
   * Starts infinite loop, executing provided callback once
   * and then entering iteration loop.
   *
   * @param {() => Promise<void> | void} [callback] - Callback function
   * to execute before starting loop.
   * @returns {Promise<void>} Promise that resolves when loop has
   * started.
   */
  async start(callback: () => Promise<void> | void = () => {}): Promise<void> {
    await callback();

    this.infinite = true;

    await this.next();
  }

  /**
   * Stops infinite loop, executing provided callback before stopping.
   *
   * @param {() => Promise<void> | void} [callback] - Callback function
   * to execute before stopping loop.
   * @returns {Promise<void>} Promise that resolves when loop has
   * been stopped.
   */
  async stop(callback: () => Promise<void> | void = () => {}): Promise<void> {
    this.infinite = false;
    await callback();
  }

  /**
   * Executes next iteration of loop, executing callback
   * before proceeding with main function.
   *
   * @param {() => Promise<void> | void} [callback] - Callback function
   * to execute before next iteration.
   * @returns {Promise<void>} Promise that resolves when next
   * iteration has been processed.
   */
  async next(callback: () => Promise<void> | void = () => {}): Promise<void> {
    await callback();

    if (this.infinite) {
      this.i += 1;
      await this.main(this);
    }
  }

  /**
   * Pauses execution for specified period of time.
   *
   * @param {number} milliseconds - Duration in milliseconds to wait.
   * @returns {Promise<void>} Promise that resolves when wait is complete.
   */
  async wait(milliseconds: number): Promise<void> {
    await wait(milliseconds);
  }
}
