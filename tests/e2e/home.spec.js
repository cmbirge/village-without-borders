// Home, "Needs you": when the tasks cannot be loaded, the page says so. It must never
// say "Nothing is waiting on you" when it simply could not look.
import { test, expect, settled } from './support/fixtures.js'

const NOTHING = 'Nothing is waiting on you right now.'
const COULD_NOT = "We couldn't load your tasks. Leave this page and come back to try again."

test('with nothing to do, Home says nothing is waiting', async ({ page, signIn }) => {
  await signIn()
  await page.goto('/')
  await settled(page)
  await expect(page.getByText(NOTHING)).toBeVisible()
  await expect(page.getByText(COULD_NOT)).toHaveCount(0)
})

test('when the tasks cannot be loaded, Home says so and does not say nothing is waiting', async ({ page, village, signIn }) => {
  await signIn()
  village.fail((r) => r.table === 'help_requests' && r.method === 'GET', 500, { message: 'internal error', code: 'XX000' })
  await page.goto('/')
  await settled(page)
  await expect(page.getByText(COULD_NOT)).toBeVisible()
  await expect(page.getByText(NOTHING)).toHaveCount(0)
})
