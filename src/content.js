
`var tailwind_css = document.createElement("script");
tailwind_css.type = "text/javascript"
tailwind_css.src = "https://cdn.tailwindcss.com"
document.body.appendChild(tailwind_css)`
//document.write("<script src='tailwindcss.js'></script>")

let scalp_it_html = `<div class='flex flex-col absolute h-96 w-72 bg-gray-100 rounded-md shadow-md shadow-slate-400 top-10 right-10 text-black z-50' id="scalp_it">
<div class='flex h-10 w-72 bg-gray-800 rounded-sm shadow-md shadow-stone-500 place-items-center text-slate-100 items-center'><h1 class="px-10 text-white">SCALP-IT</h1></div>
<div class='grid grid-cols-2 h-5/6 w-72 bg-gray-100 justify-items-center my-1'>
    <label class='block justify-center text-xs h-7 w-28'>SYMBOL</label>
    <input class='text-center h-7 w-28 text-xs rounded-md border border-gray-700' id='_symbol' list='symbols' value='BANKNIFTY'>
    <datalist id='symbols'><option value='BANKNIFTY'><option value='NIFTY'><option value='CRUDEOIL'></datalist>
    
    <label class='text-xs justify-center h-7 w-28'>EXCHANGE</label>
    <input  class='text-center h-7 w-28 text-xs rounded-md border border-gray-700'  id='_exchange' list='exchange' value='NFO'>
    <datalist id='exchange'><option value='NFO'><option value='NSE'><option value='BSE'><option value='CDS'></option><option value='MCX'></option></datalist>
        
    <label class='text-xs h-7 w-28'>ORD-TYPE</label>
    <input  class='text-center text-xs h-7 w-28 rounded-md border border-gray-700'  id='_ordtype' list='ORD-TYPE'  value='MKT'>
    <datalist id='ORD-TYPE'><option value='MKT'><option value='LMT'></datalist>
    
    <label class='text-xs h-7 w-28'>PRICE</label>
    <input  class='text-center h-7 w-28 text-xs rounded-md border border-gray-700'  id='_price' type='number' value='0'>
    
    <label class='text-xs h-7 w-28'>PRODUCT</label>
    <input  class='text-center h-7 w-28 text-xs rounded-md border border-gray-700'  id='_product' list='product' value='M'>
    <datalist id='product'><option value='M'><option value='I'><option value='C'></datalist>
    
    <label class='text-xs h-7 w-28'>EXPIRY</label>
    <input  class='text-center h-7 w-28 text-xs rounded-md border border-gray-700'  id='_expiry' list='expiry'>
    <datalist id='expiry'></datalist>
        
    <label class='text-xs h-7 w-28'>QTY</label>
    <input  class='text-center h-7 w-28 text-xs rounded-md border border-gray-700'  id='_qty' list='number' value='1'>
        
    <label class='text-xs h-7 w-28'>STRIKE</label>
    <input  class='text-center h-7 w-28 text-xs rounded-md border border-gray-700'  id='_strike' list='strike'>
    <datalist class='allStrikes' id='strike'></datalist>
    <label class='text-xs h-7 w-28'>CALL/PUT</label>
    <input  class='text-center h-7 w-28 text-xs rounded-md border border-gray-700'  id='_callput' list='callput' value='C'>
    <datalist id='callput'><option value='C'><option value='P'></datalist>
    <button class='h-6 w-16 rounded-lg bg-green-700' id="BUY">BUY</button>
    <button class='h-6 w-16 rounded-lg bg-red-500' id="SELL">SELL</button>
</div>
</div>`

let parser = new DOMParser();
let content = 'text/html';
let DOM = parser.parseFromString(scalp_it_html, content);
//let ref_el = document.getElementsByClassName("loadingall")[0];
//document.body.insertBefore(DOM.body.childNodes[0], ref_el);
document.body.appendChild(DOM.body.childNodes[0]);
document.body.getElementsByTagName("flt-glass-pane").style = "-1"


var Symbol = document.getElementById("_symbol");
var Exchange = document.getElementById("_exchange");
var Ordtype = document.getElementById("_ordtype");
var Price = document.getElementById("_price");
var Product = document.getElementById("_product");
var Expiry = document.getElementById("_expiry");
var Qty = document.getElementById("_qty");
var Strike = document.getElementById("_strike");
var Callput = document.getElementById("_callput");

var bnfStrikeMult = 100;
var nfStrikeMult = 50;

if (localStorage.getItem("EXP")){
    let EXP = JSON.parse(localStorage.getItem("EXP"));
    let e_list = document.getElementById("expiry");
    for (i=0; i < EXP.length; i++){
        let o = document.createElement("option");
        o.value = EXP[i];
        e_list.appendChild(o);
    }
}

function genrateStrike(price){
    let mult = 50;
    if (Symbol.value == "BANKNIFTY"){
        mult = 100;
    }
    let strikes = "";
    let s_list = document.getElementById("strike");

    let start = ((price / mult) * mult) - (mult * 40);
    for (i=0; i < 80; i++){
        let o = document.createElement("option");
        o.value = String(start);
        s_list.appendChild(o);
        start += mult;
    }
}

async function placeOrder(price, qty, tradingsymbol, ord_tp, sl = 0, buysell = "B", 
                exch = "NSE", prdct = "M", disc_qty = 0, amo = "NO", trigger_price = null,
                retention = 'DAY', remarks = "scalpit", bkpft = 0.0, trail_price = 0.0) {
    
    let uid = sessionStorage.getItem("uid");
    let susertoken = sessionStorage.getItem("susertoken");

    let data= {"uid": uid, "actid": uid, "trantype": buysell, "prd": prdct, "exch": exch,
                 "tsym": tradingsymbol, "qty": String(Math.abs(qty)),"dscqty": String(disc_qty), "prctyp": ord_tp, "prc": String(Math.abs(price)),
                 "trgprc": String(trigger_price), "ret": retention, "remarks": remarks, "amo": amo, 'ordersource': "WEB"};

    if (prdct == 'H'){          
      data["blprc"] = String(sl);
    }
    if (trail_price !== 0.0){
        data["trailprc"] = String(trail_price);
    }
    if (prdct == 'B'){
      data["blprc"] = String(sl);
      data["bpprc"] = String(bkpft);
    }
    if (trail_price != 0.0){
      data["trailprc"] = String(trail_price);
    }

    console.log(data);

    let req = await fetch('https://trade.shoonya.com/NorenWClientWeb/PlaceOrder', {
        method: 'POST',
        body: "jData=" + JSON.stringify(data) + "&jKey=" + susertoken
    });
    return req.text
}

function place_buy(){
    let _price = Price.value;
    let qty = Symbol.value == "BANKNIFTY" ? Qty.value * 25: Qty.value * 50;
    let tradingsymbol = Symbol.value + Expiry.value + Callput.value + Strike.value;
    let ordtp = Ordtype.value;
    let exc = Exchange.value;
    let prdct = Product.value;

    res = placeOrder(_price, qty, tradingsymbol, ordtp, sl=0, buysell="B", exch=exc, prdct=prdct)
}

function place_sell(){
    let _price = Price.value;

    let qty = Symbol.value == "BANKNIFTY" ? Qty.value * 25: Qty.value * 50;
    let tradingsymbol = Symbol.value + Expiry.value + Callput.value + Strike.value;
    let ordtp = Ordtype.value;
    let exc = Exchange.value;
    let prdct = Product.value;

    res = placeOrder(_price, qty, tradingsymbol, ordtp, sl=0, buysell="S", exch=exc, prdct=prdct)
}

function genStrikeFromInputPrice(event){
    if (event.key.toUpperCase() == "G"){
        let mult = 50;
        let price = Strike.value;
        if (Symbol.value == "BANKNIFTY"){
            mult = 100;
        }
        let strikes = "";
        let s_list = document.getElementById("strike");

        let start = ((price / mult) * mult) - (mult * 40);
        for (i=0; i < 80; i++){
            let o = document.createElement("option");
            o.value = String(start);
            s_list.appendChild(o);
            start += mult;
        }
    }
}

function onkeyStrikePrice(event){
    let mult = 50;
    if (Symbol.value == "BANKNIFTY"){
        mult = 100;
    }
    if (event.key == "ArrowDown"){
        let s_val = Math.floor(Strike.value);
        Strike.value = s_val + mult;
    }
    if (event.key == "ArrowUp"){
        let s_val = Math.floor(Strike.value);
        Strike.value = s_val - mult;
    }
}

Strike.onkeyup = onkeyStrikePrice

document.getElementById("BUY").onclick = place_buy
document.getElementById("SELL").onclick = place_sell

//document.addEventListener("keypress", genStrikeFromInputPrice);

/*
async function getIndexLTP(){
    let req = await fetch('https://trade.shoonya.com//NorenWClient/GetQuotes', {
        method: 'POST',
        body: 'jData={"uid":"FA27632","exch":"NSE","token":"Nifty%20Bank","st":"1672105790","et":"1672106390"}' + "&jKey=" + susertoken,
    });
    return req.text
    let res = await fetch("https://trade.shoonya.com//NorenWClient/GetQuotes");

}*/