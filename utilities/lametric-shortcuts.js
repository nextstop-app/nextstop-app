/* Chrome console shortcuts */

// Auto click # of single select box
const clickAmount = 475;
for(let x=0; x<clickAmount; x++){ $("#page > div > div.step1 > section.widget-line.customfields.display.customshow > div > div:nth-child(2) > div > div > div > div > div.body > div:nth-child(3) > div > div > a").click(); }

// add items to select boxes on lametric developer web ui
const items = []; 
let iterator = 0;
$("#page > div > div.step1 > section.widget-line.customfields.display.customshow > div > div:nth-child(2) > div > div > div > div > div.body > div:nth-child(3) > div > div input.option_id").each(function(){
    $(this).val(items[iterator]);
    iterator++;
});
