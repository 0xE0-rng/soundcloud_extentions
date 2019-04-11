// ==UserScript==
// @name         SoundCloud Extentions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Only works on the soundcloud search page so far, sorts loades songs by likes
// @author       xerg0n
// @match        https://soundcloud.com/search?q=*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    var append = function(){
        var node = document.createElement("button");
        node.className = "sc-button sc-button-small sc-button-responsive"
        node.innerHTML = "Sort By Likes"
        node.onclick = function (){
            var list = Array.from(document.querySelectorAll('li.searchList__item')).sort(function(a, b) {
                var a_likes = parseNumber(a.querySelector('.sc-button-like').innerText)
                var b_likes = parseNumber(b.querySelector('.sc-button-like').innerText)
                return b_likes-a_likes;
            });

            for (var i = 0; i < list.length; i++) {
                list[i].parentNode.appendChild(list[i]);
            }
        }
        document.querySelector('.searchResultGroupHeading').appendChild(node)
    }
    function parseNumber(number){
        if (number.match(/,.*K$/g)){
            number = number.replace(',','').replace('K','000')
        }
        return parseInt(number.replace('.',''))
    }
    async function waitFor(sel){
        while(!document.querySelector(sel)) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
    waitFor(".searchResultGroupHeading").then(append);
})();