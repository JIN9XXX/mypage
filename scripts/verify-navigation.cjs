const assert = require('node:assert/strict')
const { mkdir } = require('node:fs/promises')
const { chromium } = require('playwright')
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/mypage/'

;(async () => {
  await mkdir('shots', { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(url)
    await page.evaluate(async () => {
      await document.fonts.load('10px "Geist Mono Variable"')
      await document.fonts.ready
    })
    const geometry = () => page.locator('.portrait-window-image').evaluate(el => ({
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
      transform: getComputedStyle(el).transform,
    }))
    const before = await geometry()
    assert.ok(await page.evaluate(() => {
      const photo = document.querySelector('.portrait-window-image').getBoundingClientRect()
      const copy = document.querySelector('.hero-copy').getBoundingClientRect()
      return photo.left + photo.width / 2 < innerWidth / 2 && copy.left > innerWidth / 2
    }), 'Hero must keep image left and copy right')
    assert.equal(await page.locator('.page-transition-flow').count(), 0, 'No forced full-screen navigation animation')
    assert.ok(await page.locator('.intro-track').evaluate(el => el.offsetHeight <= innerHeight + 2), 'No extra scroll runway for zoom')
    await page.screenshot({ path: 'shots/home-current.png' })
    await page.evaluate(() => window.scrollTo({ top: 350, behavior: 'instant' }))
    await page.waitForTimeout(150)
    assert.deepEqual(await geometry(), before, 'Scrolling must not zoom or pan the portrait')
    assert.ok(await page.locator('.hero-stage').evaluate(el => el.getBoundingClientRect().top < -300), 'Hero must leave the viewport in normal flow')
    assert.equal(await page.locator('#story > .page-frame').evaluate(el => getComputedStyle(el).transform), 'none')
    const go = async (selector, id, padding) => {
      await page.locator(selector).click()
      await page.waitForFunction(({ id, padding }) => Math.abs(document.getElementById(id).getBoundingClientRect().top - padding) < 3, { id, padding })
    }
    await go('.desktop-nav a[href="#projects"]', 'projects', 104)
    await page.screenshot({ path: 'shots/projects-current.png' })
    const image = page.locator('.project-visual .text-reveal-image').first()
    await image.hover()
    assert.ok(await image.evaluate(el => el.classList.contains('is-revealed')))
    await page.mouse.move(10, 150)
    assert.ok(await image.evaluate(el => !el.classList.contains('is-revealed')))
    await page.goBack()
    await page.waitForFunction(() => scrollY < 3)
    await page.goto(url)
    await page.evaluate(async () => {
      await document.fonts.load('10px "Geist Mono Variable"')
      await document.fonts.ready
    })
    await page.evaluate(() => window.scrollTo({ top: document.querySelector('#work').offsetTop - 350, behavior: 'instant' }))
    const fingerprint = () => page.locator('#work .section-flow-edge').evaluate(canvas => {
      if (!canvas.width) return null
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
      let hash = 0
      for (let i = 0; i < pixels.length; i += 17) hash = (hash * 31 + pixels[i]) >>> 0
      return hash
    })
    await page.waitForTimeout(800)
    const edge = await fingerprint()
    assert.ok(edge, 'The character edge must render')
    await page.waitForTimeout(250)
    assert.equal(await fingerprint(), edge, 'The character edge must stay still when scrolling stops')
    await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }))
    await page.waitForTimeout(150)
    assert.notEqual(await fingerprint(), edge, 'The character edge must change with scroll position')
    await page.screenshot({ path: 'shots/scroll-character-boundary.png' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('.mobile-menu-toggle').click()
    await go('.mobile-nav-panel a[href="#education"]', 'education', 72)
    assert.equal(await page.locator('.mobile-menu-toggle').getAttribute('aria-expanded'), 'false')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('.mobile-menu-toggle').click()
    await go('.mobile-nav-panel a[href="#skills"]', 'skills', 72)
    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' })
    await touch.goto(`${url}#projects`)
    const touchImage = touch.locator('.project-visual .text-reveal-image').first()
    await touchImage.tap()
    assert.equal(await touchImage.getAttribute('aria-pressed'), 'true')
    await touchImage.tap()
    assert.equal(await touchImage.getAttribute('aria-pressed'), 'false')
    await touch.close()
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const id of ['top', 'story', 'work', 'education', 'projects', 'skills', 'contact']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${width}/${id}`)
        if (id !== 'top') assert.equal(await page.locator(`#${id}`).evaluate(el => getComputedStyle(el, '::after').display), 'none')
      }
    }
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded()
      await image.evaluate(image => { image.loading = 'eager'; return image.decode() })
    }
    assert.deepEqual(errors, [])
    console.log('PASS: no hero zoom, normal document flow, smooth navigation, back, scroll-linked character edges, hover/touch images, reduced motion, four viewport widths, loaded images, no runtime errors')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
