import axe from 'axe-core';
import { ComponentFixture } from '@angular/core/testing';

async function runAxe(fixture: ComponentFixture<unknown>, tags: string[]) {
  fixture.detectChanges();

  const results = await axe.run(fixture.nativeElement, {
    runOnly: { type: 'tag', values: tags },
  });

  expect(results.violations).toEqual([]);
}

export async function expectWcagACompliant(fixture: ComponentFixture<unknown>) {
  await runAxe(fixture, ['wcag2a', 'wcag21a', 'wcag22a']);
}

export async function expectWcagAACompliant(fixture: ComponentFixture<unknown>) {
  await runAxe(fixture, ['wcag2aa', 'wcag21aa', 'wcag22aa']);
}

export async function expectWcagAAACompliant(fixture: ComponentFixture<unknown>) {
  await runAxe(fixture, ['wcag2aaa']);
}

export async function expectBestPracticesCompliant(
  fixture: ComponentFixture<unknown>,
) {
  await runAxe(fixture, ['best-practice']);
}
