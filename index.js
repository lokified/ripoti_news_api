import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ripoti news api");
});

const news = [];

app.get("/accident-news", (req, res) => {
    news.length = 0
  let page = 0;

  for (let i = 0; i < 10; i++) {
    getNews(page);
    page += i;
  }

  setTimeout(() => {
    res.json(news);
  }, 3000);
});

const getNews = async (page) => {
  const response = await axios.get(
    `https://nation.africa/service/search/kenya/290754?pageNum=${page}&query=accidents&sortByDate=true&channelId=516`
  );

  const html = response.data;

  const $ = cheerio.load(html);

  $("li.search-result").each(function () {
    const title = $(this).find("h3.title-small").text();
    const smDes = $(this).find("p.text-block").text();
    const image_url = $(this).find('img').attr("data-src");
    const news_url = $(this).find("a").attr("href");

    const editedTitle = title.replace("\n", "").slice(0, title.length - 2)
    const editedSmDes = smDes.replace("\n", "").slice(0, smDes.length - 2);

    news.push({
      title: editedTitle,
      brief_description: editedSmDes,
      image_url: "https://nation.africa" + image_url,
      news_url: "https://nation.africa" + news_url
    });
  });
};

app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

app.listen(PORT, () => {
  console.log(`server running on port: http://localhost:${PORT}`);
});
