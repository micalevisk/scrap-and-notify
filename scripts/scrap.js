// @ts-check
const assert = require('assert')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const {
  TARGET_BLOG = 'https://bgd2020f1.design.blog',
  // Run document.title  on console from the dev tools in the page above
  PAGE_TITLE = 'Tópicos em BD – Big Data (Férias/2020) | Blog da Disciplina oferecida pelo Instituto de Computação da UFAM',
} = process.env

const amount = parseInt(process.argv[2], 10) // Will return all articles if this arg is suplied

// @ts-ignore
fetch(TARGET_BLOG)
  .then(res => res.text())
  .then(body => scrapPosts(body, amount))
  .then(lastsPosts => console.log( JSON.stringify(lastsPosts, null, 2)) )
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })


/**
 *
 * @param {string} body
 * @param {number} amount
 */
function scrapPosts(body, amount) {
  const $ = cheerio.load(body)
  const pageTitle = $('title').text().trim()

  // Making sure that we loaded the right page
  assert(pageTitle === PAGE_TITLE.trim(), `The page '${TARGET_BLOG}' do not have the title '${PAGE_TITLE}'`)

  /*
  <div id="content">
    <article>
      <header class="entry-header">
        <h1 class="entry-title">
          <a href="...">
        <div class="entry-meta">
          <a href="...">
            <time class="entry-date">
  */

  const lastPosts = []
  const content = $('#content')
  const allArticlesHeader = content.find('article > header.entry-header')
  if (isNaN(amount)) {
    amount = allArticlesHeader.length
  }

  for (let idx=0; idx < amount; ++idx) {
    const $title = $(allArticlesHeader[idx]).find('h1.entry-title > a')
    const $time = $(allArticlesHeader[idx]).find('div.entry-meta > a > time')
    const [date, time] = $time.attr('datetime').split('T', 2)
    lastPosts.push({
      title: $title.text(),
      link: $title.attr('href'),
      date,
      time,
    })
  }

  return lastPosts
}
