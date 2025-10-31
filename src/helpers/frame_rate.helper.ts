/**
 * Measures frame rate (frames per second) over specified duration.
 *
 * This function calculates number of frames rendered in given time
 * period and returns frame rate as Promise. First frame is not
 * included in count to ensure accuracy.
 *
 * @param {number} [milliseconds=1000] - Duration in milliseconds
 * to measure frame rate (default is 1000 milliseconds, or 1 second).
 * @returns {Promise<number>} Promise that resolves to calculated
 * frame rate in frames per second (FPS).
 */
export async function frameRate(milliseconds = 100): Promise<number> {
  return new Promise((resolve) => {
    let frameCount = 0;
    const lastTime = performance.now();

    const monitorRefreshRate = () => {
      const currentTime = performance.now();
      frameCount += 1;

      if (currentTime - lastTime >= milliseconds) {
        resolve(milliseconds / frameCount);
        return;
      }

      requestAnimationFrame(monitorRefreshRate);
    };

    monitorRefreshRate();
  });
}
