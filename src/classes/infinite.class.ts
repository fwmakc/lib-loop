import { wait } from '../helpers/wait.helper';

/**
 * Executes a given asynchronous callback function in a loop until callback returns false.
 * loop can include an optional pause between iterations.
 *
 * @param {function} callback - An asynchronous function that returns a boolean value.
 *                              Loop will continue executing as long as this function returns true.
 * @param {number} [milliseconds=0] - Amount of time to wait between each iteration of loop in milliseconds.
 *                                      If set to 0, no delay will be applied.
 * @returns {Promise<void>} A promise that resolves when loop is exited.
 */
export class Infinite {
  private i = -1;

  private infinite = false;

  private main: (args: Infinite) => Promise<void> | void = () => {};

  constructor(main: (args: Infinite) => Promise<void> | void) {
    this.main = main;
  }

  get iterate() {
    return this.i;
  }

  set iterate(value) {
    return;
  }

  async start(callback: () => Promise<void> | void = () => {}): Promise<void> {
    await callback();

    this.infinite = true;

    await this.next();
  }

  async stop(callback: () => Promise<void> | void = () => {}): Promise<void> {
    this.infinite = false;
    await callback();
  }

  async next(callback: () => Promise<void> | void = () => {}): Promise<void> {
    await callback();

    if (this.infinite) {
      this.i += 1;
      await this.main(this);
    }
  }

  async wait(milliseconds: number): Promise<void> {
    await wait(milliseconds);
  }
}
