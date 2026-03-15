import { virtual } from '@guidepup/virtual-screen-reader';

/**
 * Virtual screen reader helpers for accessibility testing.
 *
 * @example Storybook play function usage
 * ```typescript
 * import { startVirtualScreenReader, stopVirtualScreenReader, getSpokenPhrases, expectSpokenPhrasesToContain } from '@angular-comic-store/test-helpers';
 *
 * play: async ({ canvasElement }) => {
 *   await startVirtualScreenReader(canvasElement);
 *   try {
 *     const phrases = await getSpokenPhrases();
 *     expect(phrases.length).toBeGreaterThan(0);
 *     // expectSpokenPhrasesToContain(phrases, ['expected', 'announcement']);
 *   } finally {
 *     await stopVirtualScreenReader();
 *   }
 * },
 * ```
 */

/**
 * Default timeout (ms) for virtual screen reader tests. Use {@link itScreenReader}
 * in your Screen Reader describe block so you don't repeat this value.
 */
export const SCREEN_READER_TEST_TIMEOUT_MS = 10_000;

/**
 * Wrapper for Vitest `it()` that applies the screen reader timeout. Use this
 * for all tests inside your "Screen Reader" describe block so the timeout
 * is configured in one place.
 */
export function itScreenReader(
  name: string,
  fn: () => void | Promise<void>,
): void {
  it(name, fn, SCREEN_READER_TEST_TIMEOUT_MS);
}

/**
 * Start the virtual screen reader on the given container element.
 * Call {@link stopVirtualScreenReader} in afterEach to clean up.
 */
export async function startVirtualScreenReader(
  container: HTMLElement,
): Promise<void> {
  await virtual.start({ container });
}

/**
 * Stop the virtual screen reader and release resources.
 */
export async function stopVirtualScreenReader(): Promise<void> {
  await virtual.stop();
}

const MAX_NAVIGATION_STEPS = 100;

/**
 * Navigate through the container and return every spoken phrase.
 * Stops when "end of document" is announced or after MAX_NAVIGATION_STEPS
 * to avoid infinite loops in environments (e.g. jsdom) where the phrase may never occur.
 * Must be called after {@link startVirtualScreenReader}.
 */
export async function getSpokenPhrases(): Promise<string[]> {
  for (let i = 0; i < MAX_NAVIGATION_STEPS; i++) {
    const last = await virtual.lastSpokenPhrase();
    if (last === 'end of document') {
      break;
    }
    await virtual.next();
  }
  return await virtual.spokenPhraseLog();
}

/**
 * Assert that every string in {@link expected} appears as a substring
 * in at least one spoken phrase, preserving order.
 */
export function expectSpokenPhrasesToContain(
  spokenPhrases: string[],
  expected: string[],
): void {
  let searchFrom = 0;

  for (const fragment of expected) {
    const idx = spokenPhrases
      .slice(searchFrom)
      .findIndex((p) => p.includes(fragment));

    if (idx === -1) {
      throw new Error(
        `Expected "${fragment}" in spoken output after index ${searchFrom}, ` +
          `but it was not found.\nSpoken phrases: ${JSON.stringify(spokenPhrases.slice(searchFrom))}`,
      );
    }

    searchFrom += idx + 1;
  }
}
