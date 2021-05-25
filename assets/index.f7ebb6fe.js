import{o as e,c as t,F as n,r as a,a as r,t as i,d as s,p as o,b as l,w as d,v as m,e as c,f as h,g,h as p,i as u}from"./vendor.faebc471.js";var f={props:["list"]};const v={class:"flex flex-col mx-3"},x=r("h3",{class:"text-xl border-b"},"My timelines",-1),w={key:0,class:""},y={class:""},b={class:"ml-auto mt-1"},k=r("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"},null,-1),D={key:1,class:""},S=r("div",{class:""},"No saved timelines",-1);f.render=function(s,o,l,d,m,c){return e(),t("div",v,[x,l.list&&l.list.length>0?(e(),t("div",w,[(e(!0),t(n,null,a(l.list,(n=>(e(),t("div",{class:[s.selected?"bg-blue-100":"","cursor-pointer flex flex-row align-baseline mb-1 hover:bg-blue-100 rounded px-1 transition-color duration-100"],key:n,onClick:e=>s.$emit("selected",n)},[r("div",y,i(n),1),r("div",b,[(e(),t("svg",{onClick:e=>s.$emit("delete",n),xmlns:"http://www.w3.org/2000/svg",class:"h-4 w-4 hover:text-red-500",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[k],8,["onClick"]))])],10,["onClick"])))),128))])):(e(),t("div",D,[S]))])};class T{constructor(e){this.originalString=e;const t=e.indexOf("//");t>=0&&(e=e.substring(0,t));const[n,a]=e.split("-");this.from=this.toYearMonthDay(n),this.to=a?this.toYearMonthDay(a):void 0}toYearMonthDay(e){"now"===e&&(e=(new Date).toLocaleDateString());let[t,n,a]=e.split("/").reverse();const r=parseInt(t);return n?a?{year:r,month:parseInt(a),day:parseInt(n)}:{year:r,month:parseInt(n)}:{year:r}}getNextYear(){return this.to?this.to.year+1:this.from.year+1}}class C{constructor(e,t){this.linkRegex=/\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)/g,this.range=e,this.event=t}startingYear(){return this.range.from.year}getNextYear(){return this.range.getNextYear()}getInnerHtml(){return this.event.replace(this.linkRegex,((e,t,n)=>`<a href="${n}">${t}</a>`))}getDateHtml(){return this.range.originalString}}var H={props:{eventString:{type:String,default:""}},data:()=>({htmlString:""}),watch:{eventString:function(e,t){this.debouncedParse()}},computed:{frame(){return this.$refs.frame},frameDoc(){return this.frame.contentDocument},base64string(){return`data:text/html;base64,${btoa(this.htmlString)}`}},created(){this.debouncedParse=s(400,this.parse)},methods:{debouncedParse:()=>{},parse(){const e=this.eventString.split("\n").filter((e=>!!e&&null===e.match(/^\s*\/\/.*/))).map((e=>{const t=e.indexOf(":");if(-1===t)throw new Error(`Error parsing '${e}': missing separating colon (:)`);const n=e.substring(0,t).trim();return new C(new T(n),e.substring(t+1).trim())})),t=this.getBoundingYears(e);if(t.end-t.start>1e3)throw new Error("Can't make a timeline that long");this.generateDocument(t,e)},getBoundingYears(e){let t=e[0].startingYear(),n=e[0].getNextYear();for(let a of e)a.startingYear()<t&&(t=a.startingYear()),a.getNextYear()>n&&(n=a.getNextYear());return{start:t,end:n}},range:(e,t=0)=>[...Array(e).keys()].map((e=>e+t)),generateDocument(e,t){var n,a;null==(n=this.frame.contentWindow)||n.document.open().write(""),null==(a=this.frame.contentWindow)||a.document.close();const r=this.frameDoc.createElement("style");r.innerText=this.getStyles(e.end-e.start,120,t.length+1),this.frameDoc.head.append(r);const i=this.frameDoc.createElement("div");i.id="timeline",this.addYearHeaders(e,i),this.addEvents(t,e.start,i),this.frameDoc.body.append(i),this.htmlString=this.frameDoc.head.innerHTML+this.frameDoc.body.innerHTML},addYearHeaders(e,t){for(let n of this.range(e.end-e.start+1,e.start))this.addYearHeader(n,e.start,t)},addYearHeader(e,t,n){const a=e-t+1,r=a,i=this.frameDoc.createElement("div"),s=this.frameDoc.createElement("h6");s.innerText=`${e}`,s.className="yearTitle",i.className="year",i.style.cssText=`grid-column: ${a} / ${r}; grid-row: 1 / -1;`,i.append(s),n.append(i)},addEvents(e,t,n){for(let a=0;a<e.length;a++)this.addEventAtRow(e[a],a+2,t,n)},addEventAtRow(e,t,n,a){const r=this.frameDoc.createElement("div");r.className="eventRow",r.style.cssText=`grid-column: 1 / -1; grid-row: ${t}; margin-left: ${120*(e.startingYear()-n)+this.getLeftMarginForDate(e.range.from)};`;const i=this.frameDoc.createElement("div");i.style.cssText=`width: ${this.getWidthForRange(e.range)}px;`,i.className="eventBar";const s=this.frameDoc.createElement("p");s.className="eventTitle",s.innerHTML=e.getInnerHtml();const o=this.frameDoc.createElement("p");o.className="eventDate",o.innerText=e.getDateHtml(),r.append(i),r.append(o),r.append(s),a.append(r)},getLeftMarginForDate:e=>e.month?10*(e.month-1):0,getWidthForRange(e){var t,n;if(e.to){const a=10*(13-(null!=(t=e.from.month)?t:1));return e.to.month?e.from.year===e.to.year?10*(1+e.to.month-(null!=(n=e.from.month)?n:1)):a+120*(e.to.year-e.from.year-1)+10*e.to.month:e.from.year===e.to.year?a:a+120*(e.to.year-e.from.year)}return e.from.month?10:120},getStyles:(e,t,n)=>`\n        body {\n          background-color: #384047; \n          color: white; \n          height: 100vh;\n          margin: 0;\n        }\n        \n        #timeline {\n          height: 100%;\n          display: grid;\n          grid-template-columns: repeat(${e}, ${t}px [year-start]);\n          grid-template-rows: 40px repeat(${n-1}, 19px) minmax(40px, 1fr);\n        }\n\n        .year {\n          border-left: 1px dashed gray;\n          height: 100%;\n          font-family: system-ui\n        }\n\n        .yearTitle {\n          font-weight: 300;\n          margin: 0px 0px 0px 0px;\n          position: sticky;\n          top: 0px;\n          padding: 8px;\n          background: linear-gradient(to bottom, #384047, 77%, #38404700);\n        }\n\n        .eventRow {\n          margin-top: 5px;\n          display: flex;\n          flex-direction: row;\n          align-items: center;\n        }\n\n        .eventBar {\n          background-color: #ffffff4a;\n          border-radius: 5px;\n          height: 10;\n          flex-shrink: 0;\n          transition: background-color 0.075s ease-in-out;\n        }\n\n        .eventRow:hover .eventBar {\n          background-color: white;\n        }\n\n        .eventTitle {\n          margin: 0px 0px 0px 8px;\n          padding: 0px 48px 0px 0px;\n          font-family: system-ui;\n          font-size: 80%;\n          white-space: nowrap;\n        }\n\n        .eventDate {\n          color: #93979a;\n          font-family: system-ui;\n          font-size: 80%;\n          margin: 0px 0px 0px 8px;\n          white-space: nowrap;\n        }\n\n        .eventTitle a {\n          color: white;\n        }\n      `.replaceAll(/(?:\r|\n)/g,"")},mounted(){this.parse()}};const M={class:"flex flex-col"},Y={class:"flex"},N={frameborder:"0",ref:"frame",class:"flex-grow"},I={class:"flex flex-row"};H.render=function(n,a,i,s,o,l){return e(),t("div",M,[r("div",Y,[r("iframe",N,null,512)]),r("div",I,[r("a",{href:l.base64string,target:"_blank",download:"timeline.html",class:"bg-blue-100 mt-3 rounded shadow-md hover:shadow-none transition-all duration-100 px-2"},"Download HTML",8,["href"])])])};var $={components:{TimelineMaker:H,Storage:f},data:()=>({currentTimelineName:"",events:"08/2008-05/2012: Psych degree\n02/2010-06/2012: Dispatcher\n10/2010: Barn built across the street\n06/2011-08/2011: Westover Air Reserve Base\n\n// 2013\n03/15/2013-04/2015: China\n\n// 2014\n07/2014: 4th of July in DC\n\n// 2015\n05/2015-08/2015: Summer classes so I can graduate in two years\n05/2015: James graduation\n06/2015: Built desk\n06/2015: Kim and Matt wedding\n08/2015-05/2017: CS degree\n\n// 2016\n05/22/2016-08/12/2016: Cardinal Health\n08/16/2016-08/27/2016: Italy\n\n// 2017\n05/2017-05/2018: Cladwell\n06/10/2017-06/17/2017: The Hague & Copenhagen\n\n// 2018\n07/21/2018-07/22/2018: Chicago\n07/26/2018-07/31/2018: LA and Seattle (interviewing)\n08/04/2018-08/14/2018: Mexico City\n09/05/2018-09/11/2018: Hong Kong and Macau\n09/19/2018-09/22/2018: Road trip to Seattle\n10/01/2018-01/2021: [Google](https://www.google.com)\n12/28/2018-12/29/2018: Nemacolin and Fallingwater\n\n// 2019\n06/08/2019: Paula's wedding\n07/04/2019: 4th of July in Seattle with siblings\n08/23/2019-08/27/2019: SF and Bishop's Ranch\n09/2019: Hawaii with Google\n12/20/2019-12/22/2019: Train from Seattle to Chicago\n12/2019: Christmas at home, Dad to hospital\n\n// 2020\n02/29/2020: Molly and Kaitlyn to Seattle (thus starting covid)\n03/28/2020: James to Austin\n05/24/2020: Sold the Impala\n07/2020: Oregon & Crater Lake\n08/2020: Mt. Rainier\n08/2020: Oak Island\n09/2020: Hurricane Ridge\n9/2020: Trip to Coeur d'Alene\n11/2020: Trip to Denver\n12/2020: Reese\n12/25/2020: Christmas in Blaine\n\n// 2021\n01/2021: qr.new featured on [Hacker News](https://news.ycombinator.com/item?id=25481772)\n02/2021: Hawaii\n02/01/2021-now: Working on [swink](https://sw.ink) full time",list:[]}),mounted(){this.getTimelines()},methods:{deleteTimeline(e){confirm(`Delete ${e}?`)&&(localStorage.removeItem(e),this.list.splice(this.list.indexOf(e),1),localStorage.setItem("timelines",this.list.join(",")))},selectedTimeline(e){this.loadTimeline(e)},save(){const e=prompt("Save timeline as: ",this.currentTimelineName);if(e){if(localStorage.setItem(e,this.events),this.list.includes(e))return;this.list.push(e),localStorage.setItem("timelines",this.list.join(","))}},loadTimeline(e){var t;this.events=null!=(t=localStorage.getItem(e))?t:"",this.currentTimelineName=e},getTimelines(){const e=localStorage.getItem("timelines");e&&(this.list=e.split(","),this.loadTimeline(this.list[0]))}}};const E=c();o("data-v-958246ae");const R=h('<div class="flex" data-v-958246ae><a href="/" data-v-958246ae><img src="https://api.sw.ink/v0/swink/761QQ2NQBM/image?textColor=384047" data-v-958246ae></a><div class="underline flex items-end" data-v-958246ae><a href="https://github.com/kochrt/timeline-maker" data-v-958246ae>Github</a></div></div>',1),B={class:"flex md:flex-row flex-col p-3 h-100"},A={class:"flex flex-col mr-3 mb-3"};l();const L=E(((a,i,s,o,l,c)=>{const h=g("storage"),p=g("timeline-maker");return e(),t(n,null,[R,r("div",B,[r(h,{list:l.list,onSelected:c.selectedTimeline,onDelete:c.deleteTimeline},null,8,["list","onSelected","onDelete"]),r("div",A,[d(r("textarea",{class:"border shadow-md flex-grow p-2",name:"eventsField",cols:"40",rows:"10","onUpdate:modelValue":i[1]||(i[1]=e=>l.events=e)},null,512),[[m,l.events]]),r("button",{class:"bg-blue-100 mt-3 rounded shadow-md hover:shadow-none transition-all duration-100",onClick:i[2]||(i[2]=(...e)=>c.save&&c.save(...e))}," Save timeline ")]),r(p,{eventString:l.events,class:"flex-grow mr-3 mb-3"},null,8,["eventString"])])],64)}));$.render=L,$.__scopeId="data-v-958246ae";var F=p({name:"App",components:{MainVue:$}});F.render=function(n,a,r,i,s,o){const l=g("main-vue");return e(),t(l)};u(F).mount("#app");