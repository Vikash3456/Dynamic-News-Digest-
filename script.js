const rssFeedUrl = 'https://www.bhaskar.com/rss-v1--category-1741.xml';
const API_KEY = "c3bd7298dd7844e99f277311ef3ab034";
const url = "https://newsapi.org/v2/everything?q=";

async function fetchNewsFromRSS(rssUrl) {
  const response = await fetch(rssUrl);
  const data = await response.text();
  const feed = feedparser.parse(data);
  // Process the parsed RSS feed data (details below)
  feed.on('data', entry => {
    // Create a list item (LI element)
    const newsItem = document.createElement('li');

    // Extract relevant data from the entry
    const title = entry.title;
    const link = entry.link;
    const description = entry.description || ''; // Handle cases with no description

    // Set the inner HTML of the list item
    newsItem.innerHTML = `
      <a href="${link}" target="_blank">${title}</a>
      <p>${description}</p>
    `;

    // Append the list item to the container element
    document.getElementById('rss-news-list').appendChild(newsItem);
  });
}

window.addEventListener("load", () => fetchNews("India"));

function reload(){
    window.location.reload();
}
async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
  const data = await res.json();
  bindData(data.articles);
}

function bindData(articles) {
      const cardcontainer=document.getElementById('card-container');
      const newsCardTemplate = document.getElementById('template-new-card')
      
      cardcontainer.innerHTML="";
      articles.forEach(article => {
        if(!article.urlToImage) return;
        const cardclone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardclone, article);
        cardcontainer.appendChild(cardclone);
      });

      function fillDataInCard(cardClone, article) {
        const newsImg =cardClone.querySelector("#news-img");
        const newsTitle =cardClone.querySelector("#news-title");
        const newsSource =cardClone.querySelector("#news-source");
        const newsdesc =cardClone.querySelector("#news-desc");
    
     newsImg.src=article.urlToImage;
     newsTitle.innerHTML=article.title;
     newsdesc.innerHTML=article.description;
     

     const date =new Date (article.publishedAt).toLocaleDateString("en-us",{
        timeZone:"Asia/jakarta"
     });
    
     newsSource.innerHTML = `${article.source.name} - ${date}`;
     
     cardClone.firstElementChild.addEventListener("click",() =>{
        window.open(article.url, "_blank");
     });
    }
}
let curselectedNav=null;
function onNavItemClick(id){
    fetchNews(id);
    const navItem=document.getElementById(id);
    curselectedNav?.classList.remove('active');
    curselectedNav=navItem;
    curselectedNav.classList.add('active');
}

const searchbutton=document.getElementById('search-button');
const searchText=document.getElementById('search-text');

searchbutton.addEventListener("click", () => {
    const query=searchText.value;
    if(!query) return;
    fetchNews(query);
    curselectedNav?.classList.remove('active');
    curselectedNav=null;
});