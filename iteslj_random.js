// ==UserScript==
// @name         Random ESL Question
// @namespace    http://tampermonkey.net/
// @version      2024-05-25
// @description  Generate random question from iteslj.org/questions
// @match        http://iteslj.org/questions/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iteslj.org
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==


//////////////////////////
// main
//////////////////////////

(function() {
    'use strict';
    if (/^http:\/\/iteslj.org\/questions/.test (location.href) ) {
        createRandomizeSection();
    }
})();


//////////////////////////
// UI Components
//////////////////////////

function createRandomizeSection() {
    const headerSection = $('small');
    const randomizeButton = document.createElement("button");
    randomizeButton.innerHTML = "Generate Random Question";
    randomizeButton.addEventListener("click", updateRandomizeSection);

    const randomizeSection = document.createElement("div");
    randomizeSection.setAttribute("id", "randomizeSection");
    randomizeSection.appendChild(randomizeButton);
    randomizeSection.appendChild(document.createElement("h2"));
    randomizeSection.appendChild(document.createElement("hr"));
    headerSection.append(randomizeSection);
}

function updateRandomizeSection() {
    const SECTION_LINKS = $("td ul li a").map((k,v)=>v);
    const selectedSectionLink = getRandomItem(SECTION_LINKS);
    $.get(selectedSectionLink.href, (data, status)=>{
        const tempDom = $('<output>').append($.parseHTML(data));
        const availableTopics = [
            $('div.main > ul > li', tempDom),
            $('center + ul > li', tempDom),
            $('div.main > ul > ul > ul > li', tempDom),
            $('div.main > li > ul > li', tempDom),
            //$('div.main > ul > ul > li', tempDom),
        ].sort((a, b) => b.length - a.length)[0];

        const selectedTopic = getRandomItem(availableTopics);
        const topicBanner = $('#randomizeSection h2')[0];
        topicBanner.innerHTML = '';
        topicBanner.appendChild(selectedSectionLink.cloneNode(true));
        topicBanner.appendChild(document.createElement("br"));
        topicBanner.appendChild(selectedTopic);
    });
}



//////////////////////////
// utils
//////////////////////////

function getRandomItem(list) {
    const index = Math.floor((Math.random() * list.length));
    return list[index];
}


