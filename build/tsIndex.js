"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this is a Typescript version of the same code
const cheerio = __importStar(require("cheerio"));
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const PORT = 8000;
const app = (0, express_1.default)();
const url = 'https://www.theguardian.com/uk';
const base = 'https://www.theguardian.com/';
// url Validator
const isValidUrl = (urlString) => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
};
const urlBaseSet = (url, base) => {
    if (!isValidUrl(url)) {
        url = base + url;
    }
    return url;
};
(0, axios_1.default)(url)
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
        if (link == undefined)
            throw new Error('Element undefined');
        link = urlBaseSet(link, base);
        article.push({ title, link });
    });
    console.log(article);
})
    .catch((err) => console.log(err));
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
