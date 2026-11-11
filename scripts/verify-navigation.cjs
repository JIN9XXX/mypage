const assert = require('node:assert/strict')
const { mkdir } = require('node:fs/promises')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const previewUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/mypage/'

;(async () => {
  await mkdir('shots', { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const openingPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    await openingPage.goto(previewUrl)
    const radii = []
    for (const offset of [900, 650, 300, 650]) {
      await openingPage.evaluate(offset => {
        document.documentElement.style.scrollBehavior = 'auto'
        window.scrollTo(0, document.querySelector('#story').offsetTop - offset)
      }, offset)
      await openingPage.waitForFunction(() => {
        const section = document.querySelector('#story')
        const bounds = section.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight * 0.9)))
        const expected = (Math.hypot(innerWidth / 2, innerHeight / 2) + 2) * progress ** 2
        return Math.abs(parseFloat(getComputedStyle(section, '::after').getPropertyValue('--section-open-radius')) - expected) < 1
      })
      radii.push(await openingPage.locator('#story').evaluate(section =>
        parseFloat(getComputedStyle(section, '::after').getPropertyValue('--section-open-radius'))))
    }
    assert.ok(radii[0] > 0 && radii[0] < radii[1] && radii[1] < radii[2]
      && Math.abs(radii[3] - radii[1]) < 2,
    'The circular opening must follow scrolling and shrink again when scrolling back')
    await openingPage.waitForTimeout(250)
    assert.ok(Math.abs(await openingPage.locator('#story').evaluate(section =>
      parseFloat(getComputedStyle(section, '::after').getPropertyValue('--section-open-radius'))) - radii[3]) < 2,
    'The circular opening must stay still when scrolling stops')
    await openingPage.screenshot({ path: 'shots/section-opening-middle.png' })
    await openingPage.close()
    await page.goto(previewUrl)
    await page.locator('#top').waitFor()
    assert.equal(await page.locator('#work').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(25, 25, 25)',
      'The experience chapter must use the dark editorial surface')
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, document.querySelector('#work').offsetTop - 350)
    })
    await page.waitForFunction(() => {
      const canvas = document.querySelector('#work .section-flow-edge')
      return canvas.width > 500 && canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data.some((value, index) => index % 4 === 3 && value > 0)
    })
    await page.screenshot({ path: 'shots/scroll-character-boundary.png' })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForFunction(() => parseFloat(document.querySelector('.hero-stage').style.getPropertyValue('--portrait-zoom')) === 1)
    await page.evaluate(async () => {
      await document.fonts.load('14px "Geist Variable"')
      await document.fonts.load('12px "Geist Mono Variable"')
    })
    assert.ok(await page.evaluate(() => document.fonts.check('14px "Geist Variable"') && document.fonts.check('12px "Geist Mono Variable"')), 'Both locally bundled fonts must load')
    assert.ok(await page.evaluate(() => {
      const image = document.querySelector('.portrait-window-image').getBoundingClientRect()
      const copy = document.querySelector('.hero-copy').getBoundingClientRect()
      return image.left + image.width / 2 < innerWidth / 2 && copy.left > innerWidth / 2
    }), 'The desktop hero must keep the portrait on the left and introduction on the right')
    assert.equal(await page.locator('#story > .page-frame').evaluate(el => getComputedStyle(el).visibility), 'hidden',
      'The pinned intro content must not overlap the hero before its scroll transition starts')
    await page.screenshot({ path: 'shots/home-current.png' })
    await page.evaluate(() => {
      const root = document.documentElement
      root.style.scrollBehavior = 'auto'
      const track = document.querySelector('.intro-track')
      const stage = document.querySelector('.hero-stage')
      window.scrollTo(0, (track.offsetHeight - stage.offsetHeight) * 0.85)
    })
    await page.waitForTimeout(150)
    assert.ok(await page.locator('.hero-stage').evaluate(el => parseFloat(el.style.getPropertyValue('--portrait-zoom')) > 7), 'Scrolling should zoom into the portrait eye area')
    await page.screenshot({ path: 'shots/eye-zoom.png' })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(100)
    await page.evaluate(() => {
      const canvas = document.querySelector('.page-transition-flow')
      let started = false
      window.transitionCoverage = { full: false, finished: false }
      const inspect = () => {
        const covering = canvas.classList.contains('is-covering')
        if (started && !covering) {
          window.transitionCoverage.finished = true
          return
        }
        started ||= covering
        if (!covering) return requestAnimationFrame(inspect)
        const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
        let opaque = 0
        let sampled = 0
        for (let index = 3; index < pixels.length; index += 400) {
          if (pixels[index] === 255) opaque++
          sampled++
        }
        window.transitionCoverage.full ||= opaque / sampled > 0.995
        requestAnimationFrame(inspect)
      }
      inspect()
    })
    await page.locator('.desktop-nav a[href="#projects"]').click()
    await page.locator('.page-transition-flow.is-covering').waitFor()
    await page.waitForTimeout(200)
    await page.screenshot({ path: 'shots/navigation-flow.png' })
    await page.waitForFunction(() => window.transitionCoverage.finished)
    assert.ok(await page.evaluate(() => window.transitionCoverage.full),
      'The character field must cover the outgoing page before switching content')
    await page.waitForTimeout(1400)
    assert.equal(await page.locator('.page-transition-flow.is-revealing').count(), 0)
    assert.ok(Math.abs(await page.locator('#projects').evaluate(el => el.getBoundingClientRect().top) - 104) < 5)
    assert.equal(await page.locator('#projects').evaluate(el => getComputedStyle(el, '::after').display), 'none',
      'Later chapters must use the character boundary rather than repeat the intro circle')
    await page.screenshot({ path: 'shots/projects-current.png' })
    const projectImage = page.locator('.project-visual .text-reveal-image').first()
    await projectImage.hover()
    assert.ok(await projectImage.evaluate(el => el.classList.contains('is-revealed')))
    await page.mouse.move(20, 150)
    assert.ok(await projectImage.evaluate(el => !el.classList.contains('is-revealed')))
    await page.locator('.page-index').hover()
    await page.waitForTimeout(300)
    assert.ok(await page.locator('.page-index').evaluate(el => el.getBoundingClientRect().width > 200))
    await page.screenshot({ path: 'shots/page-index-expanded.png' })
    await page.locator('.page-index a[href="#projects"]').click()
    await page.waitForTimeout(1500)
    assert.equal(await page.locator('.page-index a[aria-current="location"]').getAttribute('href'), '#projects')
    await page.mouse.move(20, 150)
    await page.locator('.desktop-nav a[href="#contact"]').click()
    await page.waitForTimeout(1500)
    await page.screenshot({ path: 'shots/contact-current.png' })
    await page.goBack()
    await page.waitForTimeout(1500)
    await page.goBack()
    await page.waitForTimeout(1500)
    assert.ok(await page.evaluate(() => scrollY < 5), 'Back should restore the start of the sticky hero')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('.mobile-menu-toggle').click()
    await page.locator('.mobile-nav-panel a[href="#education"]').click()
    await page.waitForTimeout(1500)
    assert.equal(await page.locator('.mobile-menu-toggle').getAttribute('aria-expanded'), 'false')
    assert.ok(Math.abs(await page.locator('#education').evaluate(el => el.getBoundingClientRect().top) - 72) < 5)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile must not overflow horizontally')
    await page.locator('.mobile-menu-toggle').click()
    await page.locator('.mobile-nav-panel a[href="#projects"]').click()
    await page.waitForTimeout(1500)
    const mobileCard = page.locator('.project-card').first()
    assert.ok(await mobileCard.evaluate(el => {
      const image = el.querySelector('.project-visual').getBoundingClientRect()
      const copy = el.querySelector('.project-copy').getBoundingClientRect()
      return copy.top >= image.bottom - 2 && image.width > 300
    }), 'Mobile projects should stack the image above full-width copy')
    await page.screenshot({ path: 'shots/projects-mobile.png' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('.mobile-menu-toggle').click()
    await page.locator('.mobile-nav-panel a[href="#skills"]').click()
    await page.waitForTimeout(100)
    assert.ok(Math.abs(await page.locator('#skills').evaluate(el => el.getBoundingClientRect().top) - 72) < 5)
    assert.equal(await page.locator('.page-transition-flow.is-covering').count(), 0)
    const touchPage = await browser.newPage({
      viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
      reducedMotion: 'reduce',
    })
    await touchPage.goto(`${previewUrl}#projects`)
    const touchImage = touchPage.locator('.project-visual .text-reveal-image').first()
    await touchImage.tap()
    assert.equal(await touchImage.getAttribute('aria-pressed'), 'true')
    assert.ok(await touchImage.evaluate(el => el.style.getPropertyValue('--reveal-radius').endsWith('px')))
    await touchImage.tap()
    assert.equal(await touchImage.getAttribute('aria-pressed'), 'false')
    assert.ok(await touchImage.evaluate(el => !el.classList.contains('is-revealed')))
    await touchPage.close()
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.mouse.move(0, 0)
      for (const id of ['top', 'story', 'work', 'education', 'projects', 'skills', 'contact']) {
        await page.locator('#' + id).scrollIntoViewIfNeeded()
        await page.waitForTimeout(100)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px / ${id}`)
        if (width === 1440 || width === 320) await page.screenshot({ path: `shots/audit-${id}-${width}.png` })
      }
      await page.screenshot({ path: `shots/contact-${width}.png` })
    }
    assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), 'All source images and text images must load')
    assert.deepEqual(errors, [])
    console.log('PASS: character-field coverage, desktop navigation, back to hero, mobile navigation, touch reveal, image loading, reduced motion, four viewport widths, runtime errors')
  } finally {
    await browser.close()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
