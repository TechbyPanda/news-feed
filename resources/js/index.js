async function init(){
    let data = await fetchMagazines(magazines[0]);
    let headings = ["Politics", "Space", "Sports"];
    let accordion = addDivAccordion("myAccordian");
    let container = document.getElementById("container");
    magazines.forEach((element, index) => {
        let aItem = addAccordianItem(headings[index], index);
        accordion.appendChild(aItem);
        let data = fetchMagazines(element);
        setTimeout(() => {
            carouselBuilder(index, data);
        },1000);
    });
    container.appendChild(accordion);
}

// Accordians functions start
function addDivAccordion(id){
    let a = document.createElement("div");
    a.className = 'accordion';
    a.setAttribute('id',id);
    return a;
}

function addAccordianItem(heading, index){
    let a = document.createElement('div');
    a.className = 'accordion-item';
    a.appendChild(accordionHeader(heading, index));
    a.innerHTML += accordionCollapse(index,"this accordion body number "+index);
    accordionCollapse(index);
    return a;
}

function accordionHeader(heading, index){
    let h = document.createElement('h2');
    h.className = "accordion-header";
    h.setAttribute("id", `heading-${index}`);
    h.appendChild(accordionBtn(heading,index));
    return h;
}

function accordionBtn(heading, index){
    let button = document.createElement('button');
    button.className = "accordion-button "+((index === 0) ? '' : 'collapsed');
    button.setAttribute('type','button');
    button.setAttribute('data-bs-toggle','collapse');
    button.setAttribute('data-bs-target',`#collapse-${index}`);
    button.setAttribute('aria-expanded', (index === 0) ? 'true' : 'false');
    button.setAttribute('aria-controls',`collapse-${index}`);
    button.innerHTML = heading;
    return button;
}

function accordionCollapse(index){
    
    return `
        <div
            id="collapse-${index}"
            class='${(index === 0) ? "accordion-collapsSportse collapse show" : "accordion-collapse collapse"}'
            aria-labelledby="heading-${index}"
            data-bs-parent="#myAccordian"
        >
            <div class="accordion-body" id="accordion-${index}"></div>
        </div>
    `;
}

// Accordians functions end

// Carousel function start

async function carouselBuilder(index, content){
    let accordion = document.querySelector(`#accordion-${index}`);
    accordion.innerHTML = carouselDiv(index);
    let inner = document.getElementById("inner-"+index);
    let value = await content;
    console.log(value.items);
    value.items.forEach((element,idx) => {
        inner.appendChild(carouselItem(idx, element))
    })
}

function carouselItem(index, data){
    let div = document.createElement("div");
    div.className = `card w-100 h-100 carousel-item ${(index === 0) ? 'active' : ''}`;
    let img = document.createElement("img");
    img.className = "w-100 h-75";
    img.setAttribute("src",data.enclosure.link);
    div.appendChild(img);
    cardBody(div, {
        description: data.description,
        title: data.title,
        author: data.author,
        date: data.pubDate,
        content: data.content
    })
    return div;
}

function cardBody(div, {description, title, author, date, content}){
    let d = ""+new Date(date);
    let time = d.split(" ");
    console.log(time)
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `
        <h5>${title}</h5>
        <p class="fs-6">${author} ${time[2]}/${time[1]}/${time[3]}</p>
        <p>${content}</p>
    `;
    div.appendChild(cardBody)
}

function carouselDiv(index){
    return `
    <div id="carousel-${index}" class="carousel slide">
        <div class="carousel-inner" id="inner-${index}"></div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    
    </div>`;
}
// Carousel function end


async function fetchMagazines(url){
    let data = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
    let res = await data.json();
    return res;
}

export { init };