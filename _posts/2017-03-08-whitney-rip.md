---
title: WhitneyRip 👾
updated: 2017-03-08 19:21
---

![Crash](https://github.com/jameshih/jameshih.github.io/blob/main/assets/wrip/crash.png?raw=true)

### Sorry I crashed Whitney's website

The project was to build a web scraper and get as much data as possible from anywhere, so I wrote a scraper to get all the available art piece from Whitney Museum of American Art.

Click Here to see the [Leaks](https://blog.shih.app/18154_shades_of_whitney/white.html) / [Full Archive](https://blog.shih.app/18154_shades_of_whitney/index.html)

### The Hack

```
Scraping Logs

found whitney image url - https://collectionimages.whitney.org/standard/176757/largepage.jpg
seems to be randomized number naming
wrote a bash script to download all images by running numbers from 1 to 300000 (./rip.sh)
divided the work load into three days since the progress took too long to complete

obtained a total of 18154 folders, 387.2 MB, with number naming of the image as the folder name

found an easier way to scrape whitney's collection
they index their objects with - https://collection.whitney.org/object/(number)
plugged in the total number of items, 18154, obtained from the previous process
https://collection.whitney.org/object/18154

realized that the previous process missed one item

to total collection is 1-18155

began development for a node scraping tool

figured out a way to loop from 1 to 18155 with node module - lupus

discovered whitney's DDOS prevention system

got soft banned from the server for 10 minutes

solved the problem with node module - system-sleep

saving data to data.json file with node module - jsonfile

discovered a problem with the node scraping tool,
found out that whitney rendered some pages with a special vm binding structure
that prevents my node scraping tool from getting the html elements (ex:https://collection.whitney.org/object/9)

"<div id="main-webapp">
<noscript>
&lt;a href="/artists/by-letter/A"&gt;Browse artists&lt;/a&gt;
</noscript>
</div>"

------------------------------------------------------------------------------------------------------------------------

Visualization One

began working on a visualization with images obtained from bash scrape. (/public/index.html)

wrote a bash_script (./count.sh) to obtain whitney's image number naming from folder names and save to data .txt in /img

created a data.json file with data.txt

ran into a problem of too many files that crashed the browser, maximum serving is 100 images now

looking for some javascript solutions to load all images



Visualization Two

Since I have too many images, and the browser cannot handle the workload, so I decided to take a different approach and show one image at a time

inspired by Fifty Shades of Grey, I created 18154 Shades of Whitney with a show me button
when the button is clicked the site will show you one shade of whitney from the 18154 shades.

found error - https://collectionimages.whitney.org/standard/13663/largepage.jpg whitney took out access to this image from the public domain.

“Forbidden

You don't have permission to access /standard/13663/largepage.jpg on this server.”

```

#### Scraping with node server

![node](https://github.com/jameshih/jameshih.github.io/blob/main/assets/wrip/node_scrape.png?raw=true)

#### Scraping with bash scripe

![bash](https://github.com/jameshih/jameshih.github.io/blob/main/assets/wrip/bash_scrape.png?raw=true)

### Code

#### scraper.js

```javascript
var request = require("request"),
  cheerio = require("cheerio"),
  lupus = require("lupus"),
  sleep = require("system-sleep"),
  jsonfile = require("jsonfile"),
  data = [],
  file = "data.json",
  port = 9000;

//1-18155 (18156 for search) 25.216 hrs to complete on6226
lupus(13620, 18156, function (n) {
  //console.log(n);
  request(
    {
      method: "GET",
      url: "https://collection.whitney.org/object/" + n,
    },
    function (err, response, body) {
      if (err) return console.error(err);
      $ = cheerio.load(body);
      console.log(n);
      //if($('h1.xlarge').length == 0){
      $("div#main-webapp").each(function () {
        if ($("div.detail.artist").length > 0) {
          var detailArtist = $("div.detail.artist", this),
            detailTitle = $("div.detail.title", this),
            detailDate = $("div.detail.date", this),
            detailOM = $("div.detail.object-medium", this),
            detailDim = $("div.detail.dimensions", this),
            detailCL = $("div.detail.credit-line", this),
            detailAcce = $("div.detail.accession", this),
            detailCR = $("div.detail.copyright", this),
            artImg = $("img.artwork", this).attr("src"),
            holder = "p.info";

          console.log({
            id: n,
            img: artImg,
            artist: $(holder, detailArtist).text(),
            title: $(holder, detailTitle).text(),
            date: $(holder, detailDate).text(),
            medium: $(holder, detailOM).text(),
            dimension: $(holder, detailDim).text(),
            credit: $(holder, detailCL).text(),
            accession: $(holder, detailAcce).text(),
            copyright: $(holder, detailCR).text(),
          });

          data.push({
            id: n,
            img: artImg,
            artist: $(holder, detailArtist).text(),
            title: $(holder, detailTitle).text(),
            date: $(holder, detailDate).text(),
            medium: $(holder, detailOM).text(),
            dimension: $(holder, detailDim).text(),
            credit: $(holder, detailCL).text(),
            accession: $(holder, detailAcce).text(),
            copyright: $(holder, detailCR).text(),
          });

          //save to json
          jsonfile.writeFile(file, data, { spaces: 2 }, function (err) {
            console.error(err);
          });
        }
        //console.log(data);
      });
    }
  );

  //sleep delay prevent socket hungup
  sleep(5000);
});
```

#### scrape.sh

```bash
#!/bin/bash

for i in {194876..300000}

do
wget https://collectionimages.whitney.org/standard/$i/largepage.jpg -P ./img/\$i

done

```

### Art Piece Data

[view all](https://raw.githubusercontent.com/jameshih/18154_shades_of_whitney/master/leaks/data.json)

```json
[
  {
    "id": 3586,
    "img": "https://collectionimages.whitney.org/standard/102386/largepage.jpg",
    "artist": "Pamela Bianco (1906-1995)",
    "title": "Zinnias",
    "date": "1927",
    "medium": "Lithograph",
    "dimension": "Sheet: 14 1/2 × 9 11/16 in. (36.8 × 24.6 cm) Image: 11 7/16 × 6 7/8 in. (29.1 × 17.5 cm)",
    "credit": "Whitney Museum of American Art, New York; Gift of Gertrude Vanderbilt Whitney ",
    "accession": "31.606",
    "copyright": "© artist or artist’s estate"
  },
  {
    "id": 4129,
    "img": "https://collectionimages.whitney.org/standard/102387/largepage.jpg",
    "artist": "Emil Ganso (1895-1941)",
    "title": "Hilda #2",
    "date": "c. 1930",
    "medium": "Drypoint, etching, and aquatint",
    "dimension": "Sheet (Irregular): 11 13/16 × 12 3/8 in. (30 × 31.4 cm) Plate: 6 1/4 × 6 15/16 in. (15.9 × 17.6 cm)",
    "credit": "Whitney Museum of American Art, New York; Purchase ",
    "accession": "31.674",
    "copyright": "© artist or artist’s estate"
  },
  {
    "id": 4135,
    "img": "https://collectionimages.whitney.org/standard/102388/largepage.jpg",
    "artist": "Emil Ganso (1895-1941)",
    "title": "Still Life With Bottle",
    "date": "1930",
    "medium": "Wood engraving",
    "dimension": "Sheet (Irregular): 16 3/8 × 13 in. (41.6 × 33 cm) Image: 12 × 10 in. (30.5 × 25.4 cm)",
    "credit": "Whitney Museum of American Art, New York; Purchase ",
    "accession": "31.734",
    "copyright": "© artist or artist’s estate"
  }
]
```
