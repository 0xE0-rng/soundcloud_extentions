// ==UserScript==
// @name         SoundCloud Extentions
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  Only works on the soundcloud search page so far, sorts loades songs by likes
// @author       xerg0n
// @match        https://soundcloud.com/*
// @grant        none
// ==/UserScript==
/* jshint esversion: 8 */

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


        var option1 = document.createElement("option")
        option1.innerHTML = "▼ order by likes"
        option1.onclick = reorder('li div.searchItem__trackItem', '.sc-button-like')

        var option2 = document.createElement("option")
        option2.innerHTML = "▼ order by reposts"
        option2.onclick = reorder('li div.searchItem__trackItem', '.sc-button-repost')

        var select = document.createElement("select")
        select.appendChild(option1)
        select.appendChild(option2)
        select.style = "appearance: none;"
        select.className = "sc-button sc-button-small"

        container.appendChild(select)
        document.querySelector('.searchTitle__text').appendChild(container)
        console.log("appended")
    }
    function reorder(itemSel, sortKey){
        var fun = function (){
            var list = Array.from(document.querySelectorAll(itemSel))
            var sorted = [...list].sort(function(a, b) {
                var a_likes = parseNumber(a.querySelector(sortKey).innerText)
                var b_likes = parseNumber(b.querySelector(sortKey).innerText)
                return b_likes-a_likes;
            })

            for (var i = 0; i < list.length; i++) {
                list[i].parentNode.appendChild(sorted[i])
            }
    }
        }
/*     function hideReposts(){
     for (var a of document.querySelectorAll('.soundContext__repost')){
         a.parentNode.parentNode.parentNode.parentNode.style.display = 'none'
     }
    } */
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
    window.addEventListener("change", changeListener);
    window.addEventListener("load", changeListener);
    window.addEventListener("locationchange", changeListener);
})()
