import * as cheerio from 'cheerio';
import express from 'express';
import axios from 'axios';

const PORT = 8000;
const app = express();
const url = 'https://www.theguardian.com/uk';
const base = 'https://www.theguardian.com/';

// url Validator
const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

const urlBaseSet = (url, base) => {
  if (!isValidUrl(url)) {
    url = base + url;
  }
  return url;
};

axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const article = [];

    /**
     * all the following methods belong to cheerio
     * the '_' signifies unused parameter
     * Ania uses 'function()' to gain access to 'this' context,
     * since arrows functions do not contain it, i choose to target the live articles targeting it's class, this changes daily
     */
    $('.dcr-19s2zw4', html).each((_, e) => {
      const title = $(e).text();
      let link = $(e).find('a').attr('href');
      if (link == undefined) throw new Error('Element undefined');
      link = urlBaseSet(link, base);

      article.push({ title, link });
    });
    console.log(article);
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
