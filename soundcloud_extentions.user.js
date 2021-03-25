// ==UserScript==
// @name         SoundCloud Extentions
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Only works on the soundcloud search page so far, sorts loades songs by likes
// @author       xerg0n
// @match        https://soundcloud.com/*
// @grant        none
// ==/UserScript==

// https://stackoverflow.com/a/52809105
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});
(function() {
    'use strict';
    var append = function(){
        var container = document.createElement("div")
        container.id = "filterbox"
        container.style = "float: right;"

        var select = document.createElement("select")
        var option1 = document.createElement("option")
        option1.innerHTML = "▼ order by likes"
        option1.onclick = function (){
            var list = Array.from(document.querySelectorAll('li div.searchItem__trackItem'))
            var sorted = [...list].sort(function(a, b) {
                var a_likes = parseNumber(a.querySelector('.sc-button-like').innerText)
                var b_likes = parseNumber(b.querySelector('.sc-button-like').innerText)
                return b_likes-a_likes;
            });

            for (var i = 0; i < list.length; i++) {
                list[i].parentNode.appendChild(sorted[i])
            }
        }
        var option2 = document.createElement("option")
        option2.innerHTML = "▼ order by reposts"
        option2.onclick = function (){
            var list = Array.from(document.querySelectorAll('li div.searchItem__trackItem'))
            var sorted = [...list].sort(function(a, b) {
                var a_likes = parseNumber(a.querySelector('.sc-button-repost').innerText)
                var b_likes = parseNumber(b.querySelector('.sc-button-repost').innerText)
                return b_likes-a_likes;
            });

            for (var i = 0; i < list.length; i++) {
                list[i].parentNode.appendChild(sorted[i])
            }
        }
        select.appendChild(option1)
        select.appendChild(option2)
        select.style = "appearance: none;"
        select.className = "sc-button sc-button-small"

        container.appendChild(select)
        document.querySelector('.searchTitle__text').appendChild(container)
        console.log("appended")
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
    function changeListener(){
      setTimeout(() => { waitFor(".resultCounts").then(maybeappend)}, 500)
    }
    function maybeappend(){
        var elementExists = document.getElementById("filterbox");
        if (!elementExists){
            append()
        }else{
        }
    }
    var elements = document.querySelectorAll("a");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", changeListener)
    }
    window.addEventListener("change", changeListener);
    window.addEventListener("load", changeListener);
    window.addEventListener('locationchange', changeListener);
})();
