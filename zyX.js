/*! For license information please see bundle.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.zyX=t():e.zyX=t()}(self,(()=>(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{AsynConstructor:()=>T,AsyncWorker:()=>E,FocusController:()=>de,Focusable:()=>he,Fuze:()=>f,ScrollTo:()=>Te,WeakRefSet:()=>m,ZyXArray:()=>y,ZyXAudio:()=>K,ZyXDomArray:()=>v,ZyXEvents:()=>V,ZyXHtml:()=>h,ZyXInput:()=>pe,breakDelayChain:()=>P,calculateDominantColor:()=>ge,ceilClamp:()=>R,clamp:()=>U,clearDelay:()=>A,css:()=>b,debounce:()=>z,default:()=>De,delay:()=>D,delayChain:()=>S,exposeToWindow:()=>W,forQuery:()=>C,functions:()=>n,hexToHSL:()=>j,hexToRGB:()=>I,html:()=>d,isMobile:()=>Ae,minMax:()=>q,offset:()=>k,offsetLimit:()=>_,placeSafely:()=>F,pointerEventPathContains:()=>Y,resizeImageToCanvas:()=>xe,seedRandom:()=>N,seedShuffle:()=>B,setProps:()=>O,sleep:()=>x,ss:()=>H,timeoutLimiter:()=>X,urlSplitExt:()=>Ee,zyXCookie:()=>$,zyXFetchBlob:()=>_e,zyXFormPost:()=>ke,zyXGet:()=>be,zyXPost:()=>we,zyxcss:()=>w});var n={};e.r(n),e.d(n,{XboxControllerMap:()=>te,angleDistanceToTranslate:()=>ee,angleToDirection:()=>Q,calculateAngle:()=>G,calculateFourAngleSnap:()=>J,rotateDegrees:()=>Z});var o={};e.r(o),e.d(o,{click:()=>oe,clickOne:()=>ne,clickOrTwo:()=>ce,hrefDoubleClick:()=>ae,pointerDownMoveUp:()=>ie,rightClick:()=>se,wheel:()=>re});class s{constructor(e,t,n){this.keyname=e,this.type=t,this.node=n,this.setType="textContent",this.value=this.setValue(n.textContent)}set(e){return null==this.setValue(e)||this.updateNode(),!0}setValue(e){if(e===this.value)return!1;if(typeof e===this.type)return this.value=e;switch(this.type){case"number":return this.value=Number(e);case"string":return this.value=`${e}`}return!0}updateNode(){switch(this.setType){case"textContent":this.node.textContent=this.value;break;case"HTML":this.node.innerHTML=this.value}}}function i(e,t){e.hasOwnProperty(t)||(e[t]={})}const r="x0k8-zyxph-a9n3";function a(e){return`<${r} id='${e}'></${r}>`}function c(e){const t=e.match(/id='(.*?)'/);return t?.length>0?t[1]:null}const l={"zyx-click":({node:e,data:t})=>e.addEventListener("click",t.value),"zyx-dblclick":({node:e,data:t})=>e.addEventListener("dblclick",t.value),"zyx-mousedown":({node:e,data:t})=>e.addEventListener("mousedown",t.value),"zyx-mouseup":({node:e,data:t})=>e.addEventListener("mouseup",t.value),"zyx-mouseover":({node:e,data:t})=>e.addEventListener("mouseover",t.value),"zyx-mousemove":({node:e,data:t})=>e.addEventListener("mousemove",t.value),"zyx-mouseout":({node:e,data:t})=>e.addEventListener("mouseout",t.value),"zyx-mouseenter":({node:e,data:t})=>e.addEventListener("mouseenter",t.value),"zyx-mouseleave":({node:e,data:t})=>e.addEventListener("mouseleave",t.value),"zyx-keydown":({node:e,data:t})=>e.addEventListener("keydown",t.value),"zyx-keypress":({node:e,data:t})=>e.addEventListener("keypress",t.value),"zyx-keyup":({node:e,data:t})=>e.addEventListener("keyup",t.value),"zyx-focus":({node:e,data:t})=>e.addEventListener("focus",t.value),"zyx-blur":({node:e,data:t})=>e.addEventListener("blur",t.value),"zyx-submit":({node:e,data:t})=>e.addEventListener("submit",t.value),"zyx-load":({node:e,data:t})=>e.addEventListener("load",t.value),"zyx-error":({node:e,data:t})=>e.addEventListener("error",t.value),"zyx-input":({node:e,data:t})=>e.addEventListener("input",t.value),"zyx-change":({node:e,data:t})=>e.addEventListener("change",t.value),"zyx-scroll":({node:e,data:t})=>e.addEventListener("scroll",t.value),"zyx-array":({node:e,data:t})=>new v({container:e,...t.value}),"zyx-pointerdown":({node:e,data:t})=>e.addEventListener("pointerdown",t.value),"zyx-pointermove":({node:e,data:t})=>e.addEventListener("pointermove",t.value),"zyx-pointerup":({node:e,data:t})=>e.addEventListener("pointerup",t.value),"zyx-pointerover":({node:e,data:t})=>e.addEventListener("pointerover",t.value),"zyx-pointerout":({node:e,data:t})=>e.addEventListener("pointerout",t.value),"zyx-pointerenter":({node:e,data:t})=>e.addEventListener("pointerenter",t.value),"zyx-pointerleave":({node:e,data:t})=>e.addEventListener("pointerleave",t.value),"zyx-pointercancel":({node:e,data:t})=>e.addEventListener("pointercancel",t.value),"zyx-click-pop":({node:e,data:t})=>{e.addEventListener("pointerdown",(t=>{const n=e.getBoundingClientRect(),o=n.width*((t.clientX-n.x)/n.width),s=n.height*((t.clientY-n.y)/n.height);d`
			<div class="zyx-expand_circle_ctn" this=ctn>
				<div class="zyx-expand_circle" this=circle></div>
			</div>
		`.const().appendTo(e).pass((e=>{e.circle.style.left=o+"px",e.circle.style.top=s+"px",e.circle.addEventListener("animationend",(function(){e.ctn.remove()}))}))}))},"zyx-uplate":({node:e,data:t})=>{e.templates={},e.active_template="default",e.add=({template_name:t,template:n,carry_values:o}={})=>{if(t in e.templates)return e;e.templates[t]={fragments:{},values:{}};const s=e.templates[t],i=e.templates[e.active_template];o&&i.values&&Object.assign(s.values,i.values),s.template=n;const r=n.match(/{([a-z0-9]*?){(.*?)}}/gm);if(r)for(let e of r){const t=/{([a-z0-9]*?){(.*?)}}/gm.exec(e),[n,o,i]=t;i&&(s.values[o]=i),s.fragments[n]=()=>s.values[o]}return e},e.switch=t=>(e.active_template=t,e.flash(),e),e.flash=t=>{const n=e.templates[e.active_template];let o=`${n.template}`;t&&Object.assign(n.values,t);for(const[e,t]of Object.entries(n.fragments))o=o.replace(e,t());return e.innerHTML=o,e},e.add({template_name:"default",template:e.innerHTML}).flash(t)}},u=`[${Object.keys(l).join("],[")}]`;function d(e,...t){return new h(e,...t)}class h{#e=!1;#t;#n;#o;#s;#i={};#r;#a;constructor(e,...t){this.#o=function(e){const t={};for(const[n,o]of Object.entries(e)){const e=typeof o,s=!("string"===e||"number"===e);t[n]=""!==o&&o?{type:e,value:o,placeholder:s?a(n):o}:{placeholder:""}}return t}(t);const n=String.raw({raw:e},...Object.values(this.#o).map((e=>e.placeholder)));this.#n=function(e){const t=document.createElement("div");return t.innerHTML=e,t}(n),function(e){const t=e.childNodes;for(let n=0;n<2;n++)t[n]&&3===t[n].nodeType&&""===t[n].textContent.trim()&&e.removeChild(t[n])}(this.#n),this.#a=new Proxy(this,{get:(e,t)=>this.hasOwnProperty(t)?this[t]:this.#i.hasOwnProperty(t)?this.#i[t].value:e[t],set:(e,t,n)=>this.#i.hasOwnProperty(t)?this.#i[t].set(n):e[t]=n})}bind(e){return this.#r=e,e.proxy=this.#a,e.__ZyXHtml__=this,e.appendTo=e=>this.appendTo(e),e.prependTo=e=>this.prependTo(e),e.place=e=>this.place(e),this.const()}const(){return this.#e||(e=this.#n,t=this.#o,[...new Set(e.querySelectorAll(u))].forEach((e=>{const n=[...e.attributes].filter((e=>e.name.startsWith("zyx-"))).filter((e=>e.name in l));for(const o of n){const n=c(o.value);n?(l[o.name]({node:e,data:t[n]}),e.removeAttribute(o.name)):l[o.name]({node:e,data:o.value})}})),function(e,t){try{for(const n of[...e.querySelectorAll(r)])n.replaceWith(p(t[n.id].value));const n=e.innerHTML.match(a("(.*?)"));if(n)for(const o of n){const n=c(o),{placeholder:s,value:i}=t[n];e.innerHTML=e.innerHTML.replace(s,i)}}catch(n){throw console.log({markup:e,templateData:t}),n}}(this.#n,this.#o),[...this.#n.querySelectorAll("ph")].forEach((e=>{const t=[...e.attributes][0].nodeName;e.setAttribute("ph",t),this.thisAssigner(e,t)})),[...this.#n.querySelectorAll("[pr0x]")].forEach((e=>{e.__key__=e.getAttribute("pr0x"),this.#i[e.__key__]=new s(e.__key__,"string",e)})),[...this.#n.querySelectorAll("[zyx-proxy]")].forEach((e=>{e.proxy=this.#a})),[...this.#n.querySelectorAll("[this]")].forEach((e=>{this.thisAssigner(e,e.getAttribute("this")),e.removeAttribute("this")})),[...this.#n.querySelectorAll("[push]")].forEach((e=>{this.pushAssigner(e,e.getAttribute("push")),e.removeAttribute("push")})),this.#t=this.#n.childNodes.length>1?function(e){const t=document.createElement("template");return t.content.append(...e.childNodes),t}(this.#n):this.#n,this.#s=this.#t instanceof HTMLTemplateElement,this.#s?this.#t=this.#t.content:this.#t=this.#t.firstElementChild,this.#n=null,this.#o=null,this.#e=!0),this;var e,t}markup(){return this.const().#t}appendTo(e){return e.append(this.markup()),this}prependTo(e){return e.prepend(this.markup()),this}place(e){return function(e,t){if("object"==typeof t)return t.replaceWith(e);const n=document.querySelector(`ph[${t}]`);if(!n)throw new Error(t,"not found");n.replaceWith(e)}(this.markup(),e),this}touch(e){return e({proxy:this.#a,markup:this.markup()}),this}pass(e){return this.const()&&e(this),this}thisAssigner(e,t){const n=t.split(" ");if(1===n.length){const t=n[0];return e.__key__=t,this[t]=e,void(this.#r&&(this.#r[t]=e))}const[o,s]=n;i(this,o),this[o][s]=e,this.#r&&(i(this.#r,o),this.#r[o][s]=e),e.__group__=o,e.__key__=s}pushAssigner(e,t){this.hasOwnProperty(t)||(this[t]=[],this.#r&&(this.#r[t]=this[t])),e.__key__=t,this[t].push(e)}}function p(e){return e?Array.isArray(e)?function(e){const t=document.createElement("template");return t.content.append(...(n=e,n.map(p))),t;var n}(e).content:"function"==typeof e?p(e()):e?.__ZyXHtml__?e.__ZyXHtml__.markup():e instanceof h?e.markup():e instanceof HTMLTemplateElement?e.content:e:""}class m extends Set{add(e){super.add(new WeakRef(e))}forEach(e){for(const t of this.get())e(t)}delete(e){for(const t of[...super.values()])if(t.deref()===e)return super.delete(t);return!1}singleize(e){for(const t of[...super.values()])t.deref()!==e&&super.delete(t)}get(){return[...super.values()].map((e=>{const t=e.deref();return void 0===t?!super.delete(e):t})).filter((e=>e))}}class f{#o;#c;constructor(e,t){this.true=e,this.false=!e,this.#o=t,this.#c=Math.random().toString(36).substring(7)}reset(e){return this.true=!1,this.false=!0,"function"==typeof e&&e(),this}falseTrue(e,t,...n){return this.true?t(...n):e(...n),this}setTrue(){return this.true=!0,this.false=!1,this}setFalse(){return this.true=!1,this.false=!0,this}}class v{#l;#u;#d;#h;#p=new WeakMap;#m;#f;#v=null;constructor({container:e=e,array:t=null,compose:n=null,debounce:o=0,range:s=null,after:i=null}={}){if(!(t instanceof y))throw new Error("zyXDomArray target must be zyXArray");this.#l=e,e.__zyXArray__=this,this.#d=n,this.#h=i,this.#u=t,this.#f=s,this.#m=o,this.#u.addListener(this.arrayModified),this.update()}arrayModified=(e,t,...n)=>{if(console.log({array:e,method:t,elements:n}),this.#m<=0)return this.update();this.#v&&clearTimeout(this.#v),this.#v=setTimeout((()=>{this.#v=null,this.update()}),this.#m)};forEach(e){for(const t of this.entries())e(t)}entries(){return[...this.#l.children].map((e=>[e,this.#p.get(e)]))}get(e){return this.#p.get(e)}getTarget(){let e=Object.values(this.#u);return null!==this.#f&&e.length>Math.abs(this.#f)?this.#f<0?e.slice(e.length+this.#f,e.length):e.slice(0,this.#f):e}createCompose(e,...t){return this.#d?"object"==typeof this.#d.prototype?new this.#d(e,...t):this.#d(e,...t):e}update(){this.#l.innerHTML="";const e=this.getTarget(),t={item:null,element:null};let n=0;for(const s of e){const i=e[n+1],r=(o=this.createCompose(s,{prev:t,next:i,index:n}))instanceof h?o.markup():o?.__ZyXHtml__?o.__ZyXHtml__.markup():void 0;if(r instanceof HTMLTemplateElement||r instanceof DocumentFragment)throw Error("cannot associate reactive object with a template element");this.#l.append(r),this.#p.set(r,s),"symbol"!=typeof s&&"object"!=typeof s||this.#p.set(s,r),t.item=s,t.element=r,n++}var o;this.#h&&this.#h()}}class y extends Array{#y=new m;addListener(e){this.#y.add(e)}removeListener(e){this.#y.delete(e)}constructor(...e){super(...e)}clear(){super.splice(0,this.length),this.#y.forEach((e=>e(this,"clear")))}push(...e){super.push(...e),this.#y.forEach((t=>t(this,"push",...e)))}pop(...e){super.pop(...e),this.#y.forEach((t=>t(this,"pop",...e)))}shift(...e){super.shift(...e),this.#y.forEach((t=>t(this,"shift",...e)))}unshift(...e){super.unshift(...e),this.#y.forEach((t=>t(this,"unshift",...e)))}splice(...e){super.splice(...e),this.#y.forEach((t=>t(this,"splice",...e)))}}class g{constructor({root:e}={}){d`
			<styles this=styles></styles>
		`.bind(this),e&&this.appendTo(e)}loadUrl(e){return new Promise(((t,n)=>{d`<link rel="stylesheet" type="text/css" this=link href="${e}">`.appendTo(this.styles).pass((({link:e}={})=>{e.onload=()=>t({link:e,cleanuUp:()=>e.remove()}),e.onerror=n}))}))}async str(e,...t){const n=String.raw(e,...t);if(!String(n).startsWith("url("))return d`
			<style this=style></style>
		`.appendTo(this.styles).pass((({style:e}={})=>{e.innerHTML=n}));{const e=n.split("url(").slice(1).map((e=>e.split(")")[0]));for(const t of e)await this.loadUrl(t)}}cloneType(e){return new g({root:e})}}const w=new g({root:"undefined"!=typeof document&&document.head}),b=(e,...t)=>w.str(e,...t);function k(e,t){return Math.max(0,(-t+e)/(1-t))}function _(e,t){return Math.min(1,e/t)}function x(e){return new Promise(((t,n)=>setTimeout(t,e)))}b`
	ph {
		display: none;
	}
`;class E{constructor({url:e,type:t="module"}={}){this.sW=new Worker(e,{type:t}),this.serviceWorkerTasks={},this.sW.onmessage=this.serviceWorkerResponse.bind(this),this.callbacks={}}on(e,t){e in this.callbacks||(this.callbacks[e]=[]),this.callbacks[e].push(t)}callCallback(e){const t=this.callbacks[e.event];if(t)for(const n of t)n(e.data)}serviceWorkerResponse(e){if("event"in e.data)return this.callCallback(e.data);const{taskID:t,reject:n}=e.data,o=this.serviceWorkerTasks[t];if(delete this.serviceWorkerTasks[t],n)return o.reject(n);o?.resolve(e.data)}task({task:e,data:t}){return new Promise(((n,o)=>{const s=Math.random().toString(36).slice(2,10),i={task:e,taskID:s,resolve:n,reject:o};this.serviceWorkerTasks[s]=i,this.sW.postMessage({task:e,data:t,taskID:s})}))}}class T{constructor({delay:e=1,microtask:t=!1}={}){"function"==typeof this.asynConstructor?t?queueMicrotask((e=>this.asynConstructor())):setTimeout((e=>this.asynConstructor()),e):console.warn("you are using a (new AsynConstructor()) class without an async asynConstructor method.")}}const M=new WeakMap;"undefined"!=typeof window&&(window.zyxMap=M);const L=(e,t)=>{let n=M.get(e);return n||(M.set(e,{banks:{}}),n=M.get(e)),t in n.banks||(n.banks[t]={}),n.banks[t]};function S(e,t){const n=L(e,"delayChains");if(t in n){for(const e of n[t].pending)clearTimeout(e);n[t].pending=[],n[t].callbacks=[]}else n[t]={callbacks:[],pending:[]};const o=()=>n[t].callbacks.length>0&&n[t].callbacks.splice(0,1)[0](),s=()=>({then:(e,i)=>(n[t].callbacks.push((()=>{n[t].pending.push(setTimeout((t=>{e(),o()}),i))})),s())});return n[t].pending.push(setTimeout(o,1)),s()}function P(e,t){const n=L(e,"delayChains");if(t in n){for(const e of n[t].pending)clearTimeout(e);n[t]={callbacks:[],pending:[]}}}function D(e,t,n,o){return new Promise(((s,i)=>{const r=L(e,"delays");t in r&&clearTimeout(r[t]),n=n||0,r[t]=o?setTimeout((()=>s(o())),n):setTimeout(s,n)}))}function A(e,...t){const n=L(e,"delays");if(t.length>1)for(const e in t)e in n&&clearTimeout(n[e]);else clearTimeout(n[t[0]])}function z(e,t,n,o){const s=L(e,"debouncers");if(t in s)s[t](n);else{try{n(),n=null}catch(e){throw new Error(e)}setTimeout((e=>{try{n&&n()}catch(e){throw new Error(e)}delete s[t]}),o),s[t]=e=>n=e}}function C(e,t,n){return[...e.querySelectorAll(t)].forEach((e=>n(e)))}function O(e,t){Object.entries(t).forEach((([t,n])=>e.style.setProperty(t,n)))}async function F(e,t,n,o){t.appendChild(e),e.style[o>=0?"top":"bottom"]=Math.abs(o)+"em",e.style[n>=0?"left":"right"]=Math.abs(n)+"em",await x(1);const{offsetWidth:s,offsetHeight:i}=e,{offsetWidth:r,offsetHeight:a}=t,{left:c,top:l,bottom:u,right:d}=e.getBoundingClientRect();(c<0||l<0||u>a||d>r)&&(u>a&&(e.style.top=a-i+"px"),d>r&&(e.style.left=r-s+"px"))}function X({cooldown:e=60,last:t}={}){return()=>!(performance.now()-t<e||(t=performance.now(),0))}function Y(e,t){return(e.composedPath&&e.composedPath()).some((e=>e.matches?.(t)))}function I(e){return e=e.replace("#",""),{r:parseInt(e.substring(0,2),16)/255,g:parseInt(e.substring(2,4),16)/255,b:parseInt(e.substring(4,6),16)/255}}function j(e){const{r:t,g:n,b:o}=I(e),s=Math.max(t,n,o),i=Math.min(t,n,o),r=(s+i)/2;let a=0;s!==i&&(a=r>.5?(s-i)/(2-s-i):(s-i)/(s+i));let c=0;return s!==i&&(c=s===t?(n-o)/(s-i):s===n?2+(o-t)/(s-i):4+(t-n)/(s-i)),c*=60,c<0&&(c+=360),{h:Math.round(c),s:Math.round(100*a),l:Math.round(100*r)}}function W(e){for(const[t,n]of Object.entries(e))window[t]=n}function H(e){return e>1?"s":""}function U(e,t,n){return Math.max(t,Math.min(n,e))}function R(e,t,n){return Math.min(Math.max(Math.ceil(e),t),n)}function q(e,t,n){return Math.min(Math.max(e,t),n)}function B(e,t){for(let n=e.length-1;n>0;n--){const o=Math.floor(N(t)*(n+1));[e[n],e[o]]=[e[o],e[n]],t++}return e}function N(e){const t=1e4*Math.sin(e++);return t-Math.floor(t)}const $=new class{constructor(){}get(e,t){const n=e+"=",o=decodeURIComponent(document.cookie),s=o.split(";");if(!o.includes(e))return this.set(e,t),t;for(let e in s){let t=s[e];for(;" "==t.charAt(0);)t=t.substring(1);if(0==t.indexOf(n)){let e=t.substring(n.length,t.length);return"true"===e||"false"===e?"true"===e:e}}return""}set(e,t,n){const o=new Date;n?o.setTime(o.getTime()+24*n*60*60*1e3):o.setTime(o.getTime()+8639136e5);const s="expires="+o.toUTCString();document.cookie=`${e}=${t};${s};path=/`}delete(e){console.log("deleting cookie",e),this.set(e,"",-1)}};class V{#g={};on(e,t){e.includes(",")?e.split(",").forEach((e=>this.on(e,t))):(e in this.#g||(this.#g[e]=[]),this.#g[e].push(t))}call(e,...t){const n=this.#g[e];if(n)for(const e of n)e(...t)}}class K{constructor(e){this.AUDIO_ROOT=e,this.ctx=new AudioContext,this.gainNode=this.ctx.createGain(),this.gainNode.gain.value=1,this.gainNode.connect(this.ctx.destination),this.SOUNDS={},this.muted=!1}addSound(e){return new Promise(((t,n)=>{if(Object.keys(this.SOUNDS).includes(e))return t();let o=new XMLHttpRequest;o.onload=o=>{this.ctx.decodeAudioData(o.target.response,(n=>{this.SOUNDS[e]=n,t(this.SOUNDS[e])}),(e=>{n(e)}))},o.open("GET",this.AUDIO_ROOT+e,!0),o.responseType="arraybuffer",o.send()}))}stop(e){e.stop&&e.stop(),e.disconnect&&e.disconnect()}toggleMute(){return this.muted=!this.muted,this.muted}createBuffer(e,t){const n=this.ctx.createBufferSource();return n.buffer=this.SOUNDS[e],n.connect(this.gainNode),t?n.onended=()=>t():t=()=>{this.stop(n)},n}createAndExecute(e,t){return this.createBuffer(e,t).start(0)}async play({source:e,name:t,looping:n=!1,delay:o=0,volume:s=1,loopOnEnded:i,n:r=0}={}){if(await this.addSound(t),0!==(s=this.muted?0:s)){if(this.gainNode.gain.value=function(e){return e<=0?0:e>=1?1:Math.pow(e,3)}(s),n||r){n=!0;let e=r-- >0;return i=()=>{!n||e&&r--<=0||setTimeout((e=>{this.createAndExecute(t,i)}),o)},{source:this.createAndExecute(t,i),stop:()=>n=!1}}this.createAndExecute(t)}}}function Z(e,t){return(e+t)%360}function Q(e){return["up","right","down","left"][Math.round(e/90)%4]}function G(e,t,n,o){const s=n-e,i=o-t;let r=Math.atan2(i,s)*(180/Math.PI);return r<0&&(r+=360),r+=90,r>=360&&(r-=360),r}function J(e){return[0,90,180,270,0][Math.round(e/90)%4]}function ee(e,t){const n=(e=Z(e,-90))*Math.PI/180;return"translate("+t*Math.cos(n)+"px, "+t*Math.sin(n)+"px)"}const te={1:"x-uppad",2:"x-downpad",3:"x-leftpad",4:"x-rightpad",5:"x-menu",6:"x-start",7:"x-rightjoy",8:"x-leftjoy",9:"x-leftbumper",10:"x-rightbumper",13:"x-A",14:"x-X",15:"x-B",16:"x-Y"};function ne(e,{onClick:t=null,onDown:n=null,once:o=!1,capture:s=!1,stopPropagation:i=!1,stopImmediatePropagation:r=!1,preventDefault:a=!0,label:c="click"}){const l=o=>{if(i&&o.stopPropagation(),r&&o.stopImmediatePropagation(),1!==o.which)return;const s=this.beforePointerEvent("clickone",o);if(!s)return;const a=n?.(o),{clientX:l,clientY:u,target:d}=o,h=new f(!0,{label:c});this.activeEvents.add(h);const{check:p}=this.moveTripper({startX:l,startY:u});e.addEventListener("pointerup",(e=>{!p(e)&&h.true&&e.target===d&&(this.kingOfTheStack(h),t({dwn_e:o,up_e:e,down_return:a},s))}),{once:!0})};return e.addEventListener("pointerdown",l,{once:o,capture:s}),a&&e.addEventListener("click",(e=>e.preventDefault()),{once:o,capture:s}),{unbind:t=>{e.removeEventListener("pointerdown",l,{capture:s}),e.removeEventListener("click",(e=>e.preventDefault()),{capture:s})}}}function oe(e,t){console.log("bind click"),e.setAttribute("click-enabled",""),e.addEventListener("pointerdown",(n=>{console.log("pointerdown");const o=this.beforePointerEvent("custom-click",n);if(console.log("caa",o),!o)return nullifyEvent(n);e.addEventListener("click",(()=>{console.log("lick"),t()}),{once:!0})}))}function se(e,{onDown:t,onUp:n,once:o=!1,capture:s=!1,label:i="rightclick"}={}){this.on(e).pointerDownMoveUp({label:i,onDown:({dwn_e:o,b4:s,moveFuse:i,pointerDown:r,eventFuse:a}={})=>(t?.({dwn_e:o,b4:s}),De(e).delay("pointer-down",this.mobilePressHoldDelay,(()=>{i.true||r.false||a.false||(this.kingOfTheStack(a),n({dwn_e:o}))})),!0),onUp:({up_e:e,dwn_e:t,moveFuse:o})=>{if("mouse"===e.pointerType&&2===e.button){if(o.true)return;n({up_e:e,dwn_e:t})}},once:o,capture:s})}function ie(e,{onDown:t,onStartMove:n,onMove:o,onUp:s,once:i=!1,deadzone:r=null,capture:a=!1,captureMove:c=!1,verbose:l=!1,stopPropagation:u=!1,stopImmediatePropagation:d=!1,stopMovePropagation:h=!1,stopImmediateMovePropagation:p=!1,movePrecision:m=1,label:v="pointerDownMoveUp"}={}){const y=i=>{if(r=r||this.moveTripperDist,!this.beforePointerEvent("pointerDownMoveUp",i))return!1;const{eventFuse:a=new f(!0,{label:v}),pointerDown:y=new f(!0,{label:v}),startX:g,startY:w}={startX:i.clientX,startY:i.clientY};this.activeEvents.add(a);const{moveFuse:b,check:k}=this.deadzone({startX:g,startY:w,deadzone:r});u&&i.stopPropagation(),d&&i.stopImmediatePropagation();let{startAngle:_=null,moveCalledOnce:x=!1,latest_move_e:E=null,startMove:T,pixels_moved:M=0}={};const L=t({dwn_e:i,moveFuse:b,pointerDown:y,eventFuse:a,kingOfTheStack:e=>this.kingOfTheStack(a),pathContains:e=>Y(i,e)});if(!L)return!1;const S=e=>G(g,w,e.clientX,e.clientY),P=e=>Math.sqrt(Math.pow(e.clientX-g,2)+Math.pow(e.clientY-w,2)),D=e=>J(S(e)),A=t=>{try{if(a.false)return l&&console.log({element:e},"eventFuse.false, returning"),C();if(M++,m>1){if(M<m)return;M=0}if(E=t,!k(t))return;_||(_=S(t));const r={dwn_e:i,mv_e:t,startX:g,startY:w,startAngle:_,movementX:t.movementX,movementY:t.movementY,stop:C,up:z,moveFuse:b,startMove:T,kingOfTheStack:e=>this.kingOfTheStack(a),clearAllSelections:()=>this.clearAllSelections(),fourAngleSnap:()=>D(t),angleFromStart:()=>S(t),distanceFromStart:()=>P(t),direction:()=>Q(S(t))};if(h&&t.stopPropagation(),p&&t.stopImmediatePropagation(),x&&o)return o(r,L);if(n){if(T=n(r,L),!T)return!1;"object"==typeof T&&null!==T&&("onMove"in T||"onUp"in T)&&(T?.onMove&&(o=T.onMove),T?.onUp&&(s=T.onUp))}this.kingOfTheStack(a),x=!0}catch(e){console.error(e)}},z=e=>{y.setFalse(),C(),s&&s({dwn_e:i,up_e:e,mv_e:E,startX:g,startY:w,startAngle:_,startMove:T,moveFuse:b,onStartMove:n,fourAngleSnap:()=>D(e),angleFromStart:()=>S(e),distanceFromStart:()=>P(e),direction:()=>Q(S(e))},L)};document.addEventListener("pointermove",A,{capture:c}),document.addEventListener("pointerup",z),document.addEventListener("pointercancel",z);const C=e=>{document.removeEventListener("pointermove",A,{capture:c}),document.removeEventListener("pointerup",z),document.removeEventListener("pointercancel",z)}};return e.addEventListener("pointerdown",y,{once:i,capture:a}),{removeEventListener:t=>e.removeEventListener("pointerdown",y,{capture:a})}}function re(e,{onWheel:t,capture:n=!1,passive:o=!1}={}){e.addEventListener("wheel",(e=>{t({whl_e:e,killPropagation:()=>e.stopPropagation()&&e.stopImmediatePropagation(),pathContains:t=>pointerEventPathContains(e,t)})}),{capture:n,passive:o})}function ae(e,...t){this.on(e).clickOrTwo({single:t=>window.open(e.href,"_blank"),double:t=>window.open(e.href,"_blank",["height=1400","width=1000","top=10","left=10"].join(","))})}function ce(e,{single:t,double:n,doubleWait:o=!1,cooldown:s,cooldownDuration:i=350,label:r="click-or-two",preventDefault:a=!0}={},{active_fuse:c=new f,db_fuse:l=new f}={}){this.on(e).clickOne({preventDefault:a,label:r,onClick:({dwn_e:e,up_e:r})=>{if(!s){if(c.true)return l.setTrue();De({}).delay("click",o||this.clickOrTwoWindowMs,(()=>{c.reset(),l.falseTrue((n=>t(e)),(t=>{n(e),s=setTimeout((()=>s=null),i)})),l.reset()})),c.setTrue()}}})}class le{constructor(e,t,{scrollTarget:n,overrideDefaultScroll:o=!1,onPointerMove:s,onScroll:i}={}){this.container=t,this.scrollTarget=n||t,this.velocityY=0,this.animating=!1,this.pointerDown=!1,this.friction=.94,this.direction="down",this.minVelocityY=1,this.maxVelIncr=20,this.maxVelocityY=400,this.smallDeltaStep={floor:10,culm:0,culmLimit:40,tick:50},o&&this.container.addEventListener("wheel",(e=>{i&&!i(e)||this.wheel(e)}),{capture:!0,passive:!1}),e.on(this.container).pointerDownMoveUp({capture:!0,captureMove:!0,onDown:()=>(this.pointerDown=!0,{selectionRange:window.getSelection()}),onStartMove:({direction:e,stop:t,clearAllSelections:n}={})=>{const o=e();return"left"===o||"right"===o?t():(n(),!0)},onMove:({mv_e:e,movementY:t}={},{}={})=>{if(e.stopPropagation(),e.stopImmediatePropagation(),0===t)return;this.container.classList.add("Scrolling"),s&&s({mv_e:e,movementY:t});let n=e.shiftKey?1:.5;e.altKey&&(n/=4);const o=t*-n;this.addVelocity(o)},onUp:()=>{this.container.classList.remove("Scrolling"),this.pointerDown=!1}}),this.tick_length=8,this.lastFramePerf=null}__animate__(){!this.animating&&(this.animating=!0)&&requestAnimationFrame(this.__frame__.bind(this))}__framedelta__(){const e=performance.now();if(null===this.lastFramePerf)return this.lastFramePerf=e,0;const t=e-this.lastFramePerf;return this.lastFramePerf=e,t/this.tick_length}__frame__(){const e=this.__framedelta__(),t=this.pointerDown?.95*this.friction:this.friction;this.velocityY*=Math.pow(t,e);const n=Math.abs(this.velocityY),o=this.velocityY*e;if(this.scrollTarget.scrollTop+=o,n<this.minVelocityY)return this.lastFramePerf=null,void(this.animating=!1);this.animating&&requestAnimationFrame(this.__frame__.bind(this))}checkCounterScroll(e){(e.deltaY>0&&this.velocityY<0||e.deltaY<0&&this.velocityY>0)&&(this.velocityY/=10)}resetVelocity(){this.velocityY/=10,this.__animate__()}addVelocity(e){(e>0&&this.velocityY<0||e<0&&this.velocityY>0)&&(this.velocityY/=10),this.velocityY=Math.min(this.velocityY+e,this.maxVelocityY),this.__animate__()}wheel(e){e.preventDefault(),e.stopPropagation(),this.checkCounterScroll(e),this.direction=e.deltaY>0?"down":"up",Math.abs(e.deltaY)<this.smallDeltaStep.floor?(this.smallDeltaStep.culm+=e.deltaY,Math.abs(this.smallDeltaStep.culm)>this.smallDeltaStep.culmLimit&&(this.addVelocity(this.smallDeltaStep.tick*this.direction=="down"?1:-1),this.smallDeltaStep.sum=0)):this.addVelocity(.1*e.deltaY)}}class ue{constructor(){this.tapsToExit=3,this.backPresses=this.tapsToExit,window.history.pushState({},""),window.addEventListener("popstate",(()=>this.handleBackButton())),d`
			<div this="tap_indicator" class="tap-to-exit-confirm">
				<div class="tap-to-exit-label" pr0x="nth">Go back 3 more times to exit app.</div>
			</div>
		`.bind(this),this.onBack=[]}handleBackButton(){const e=this.onBack.sort(((e,t)=>e.weight>t.weight?1:-1));for(const t of e){const e=t.cb.deref();if(e){if(e())return void window.history.pushState({},"")}else this.onBack.splice(this.onBack.indexOf(t),1)}this.backPresses<3&&window.navigator.vibrate([300]),De(this).delay("back-panic",700,(()=>{this.backPresses=this.tapsToExit,window.history.pushState({},""),this.tap_indicator.classList.remove("visible")})),this.tap_indicator.classList.add("visible");const t=Math.max(1,this.backPresses);var n;return this.proxy.nth=`Go back ${t} more time${n=t,n>1?"s":""} to exit app.`,this.backPresses--,Ae()&&this.backPresses<=0||this.backPresses<0?window.history.back():void window.history.pushState({},"")}on(e,t){this.onBack.push({cb:new WeakRef(e),weight:0,...t})}}class de{constructor(e){this.default_focusable=e,this.focused_module_ref=null}getFocusedModule(){const e=this.focused_module_ref?.deref();return e?!e?.__focusable__ instanceof he?(raise("Module is not binded with focusable class."),null):e:null}setDefaultFocusable(e){if(!e.__focusable__ instanceof he)throw new Error("Module is not focusable class.");this.default_focusable=e}setFocus(e){const t=this.getFocusedModule();if(t&&t.__unFocus__?.(),null===e&&(e=this.default_focusable),!e.__focusable__)throw new Error("Module is not focusable class.");e=e.__focusable__.redirect(),this.focused_module_ref=new WeakRef(e),e.__focus__?.()}}class he{constructor(e){this.module=e,this.focused=!1,this.redirect_to=null}redirect(){const e=this.redirect_to?.deref();return e||this.module}setRedirection(e){e||(this.redirect_to=null),this.redirect_to=new WeakRef(e)}focus(){this.focused=!0}unFocus(){this.focused=!1}}class pe{constructor({customQueryFunc:e,customClearSelections:t,onKeyPress:n=null}={}){this.onKeyPress=n,this.customQueryFunc=e,this.customClearSelections=t,this.focus=new de,this.enabledDefaults=["Tab","Esc","F5","F11","F12","KeyI","KeyC","KeyV","KeyX"],document.addEventListener("keypress",(e=>this.keyEvent("keypress",e))),document.addEventListener("keydown",(e=>this.keyEvent("keydown",e))),document.addEventListener("keyup",(e=>this.keyEvent("keyup",e))),this.activeEvents=new m,this.openModals=new m,document.addEventListener("click",(e=>!this.beforePointerEvent("default-click",e)&&me(e))),this.mouse={x:0,y:0,pointerDown:!1},document.addEventListener("pointermove",(e=>(this.mouse.x=e.clientX,this.mouse.y=e.clientY))),document.addEventListener("pointerdown",(e=>(this.mouse.x=e.clientX,this.mouse.y=e.clientY,this.mouse.pointerDown=!0))),document.addEventListener("pointerup",(e=>this.mouse.pointerDown=!1)),document.addEventListener("pointerleave",(e=>this.mouse.pointerDown=!1)),document.addEventListener("contextmenu",(e=>{if(e.shiftKey||Y(e,"[context-menuable]"))return!1;me(e)})),this.on(document).dragstart((e=>{})),this.listenToController=!1,this.clickOrTwoWindowMs=350,this.moveTripperDist=5,this.mobilePressHoldDelay=550,this.backHandler=new ue(this),this.backHandler.on((e=>this.processModalEvent()),{weight:1e3})}on(e){return new Proxy(o,{get:(t,n)=>this.customEventHandlers(e,n)})}customEventHandlers(e,t){if(o[t])return(...n)=>o[t].bind(this)(e,...n);switch(t){case"pointerdown":case"pointerup":case"dragstart":return n=>{e.addEventListener(t,(e=>{const o=this.beforePointerEvent(t,e);n(e,o)}))};default:throw new Error(`Event function ${t}(elem, ...args) not found in ZyXInput.presets`)}}bindMomentumScroll(e,t){return new le(this,e,t)}queryApplication(e){return this?.customQueryFunc?.(e)||document.querySelectorAll(e)}clearAllSelections(){this?.customClearSelections?.()||window.getSelection().removeAllRanges()}nullAllEvents(){this.activeEvents.clear()}kingOfTheStack(e){this.activeEvents.singleize(e)}beforePointerEvent(e,t){const n=t.target?.matches("input[type=checkbox] , input[type=radio] , button");if(n)return t.stopPropagation(),t.stopImmediatePropagation(),!0;switch(e){case"default-click":if(!t.pointerType)return!0;if(t.target?.matches("[click-enabled]"))return!1;case"pointerdown":case"dragstart":if(t.target?.matches("a, [click-enabled]"))return!1;case"pointerDownMoveUp":case"pointerdown":case"dragstart":case"custom-click":case"clickone":case"clickortwo":if(this.processModalEvent(t))return!1;default:return!0}}processModalEvent(e){const t=this.openModals.get();return t.length<0||t.length>0&&(!e||!Y(e,"[zyx-input-modal]"))&&(t.forEach((e=>e.clickedOutside(e))),this.nullAllEvents(),e.stopPropagation(),e.stopImmediatePropagation(),this.openModals.clear(),!0)}isolateEventWithinContainer(e,t){this.openModals.add(e),e.setAttribute("zyx-input-modal",""),e.clickedOutside=t.bind(e)}moveTripper({startX:e,startY:t,deadzone:n}={}){const{moveFuse:o,check:s}=this.deadzone({startX:e,startY:t,deadzone:n});return document.addEventListener("pointermove",s),document.addEventListener("pointerup",(()=>document.removeEventListener("pointermove",s)),{once:!0}),{moveFuse:o,check:s}}deadzone({startX:e,startY:t,deadzone:n=this.moveTripperDist,moveFuse:o=new f}={}){return{moveFuse:o,check:s=>(Math.hypot(s.clientX-e,s.clientY-t)>n&&o.setTrue(),o.true)}}async keyEvent(e,t){try{if(t.ctrlKey||t.metaKey||this.queryApplication("input:focus,textarea:focus").length>0)return!1;this?.onKeyPress?.(e,t);const n=this.focus.getFocusedModule();if("function"!=typeof n?.keyEvent)return!1;t.joy||this.enabledDefaults.includes(t.code)||(t.preventDefault(),t.stopPropagation()),await(n?.keyEvent(e,t))}catch(n){throw console.error("[Key Event Error Additional Context]",{event:e,e:t}),n}}socketXinputEvent(e){if(!this.listenToController)return;const t=1===e.pressed?"keydown":"keyup";this.keyEvent(t,{joy:!0,key:te[e.button]})}}function me(e){return e.stopPropagation(),e.stopImmediatePropagation(),e.preventDefault(),!1}const fe=document.createElement("canvas");fe.width=500,fe.height=500;const ve=200,ye=fe.getContext("2d",{willReadFrequently:!0});function ge(e){return new Promise(((t,n)=>{const o=new Image;o.crossOrigin="Anonymous";let s,i,r=-4,a={r:0,g:0,b:0},c=0;o.src=e,o.onload=()=>{if(ye.drawImage(o,0,0,500,500),!ye)return t();try{s=ye.getImageData(0,0,500,500)}catch(e){return console.log("error",e),t()}for(i=s.data.length;(r+=120)<i;)++c,a.r+=s.data[r],a.g+=s.data[r+1],a.b+=s.data[r+2];o.remove(),a.r=~~(a.r/c),a.g=~~(a.g/c),a.b=~~(a.b/c);const e=a.r/=255,n=a.g/=255,l=a.b/=255,u=Math.min(e,n,l),d=Math.max(e,n,l),h=d-u;let p=0,m=0,f=0;p=0==h?0:d==e?(n-l)/h%6:d==n?(l-e)/h+2:(e-n)/h+4,p=Math.round(60*p),p<0&&(p+=360),f=(d+u)/2,m=0==h?0:h/(1-Math.abs(2*f-1)),m=(100*m).toFixed(1),f=(100*f).toFixed(1),m<3&&(p=ve),t({h:p,s:m,l:f})}}))}function we(e,t){return fetch(e,{headers:new Headers({"Content-Type":"application/json"}),method:"POST",credentials:"include",body:JSON.stringify(t)})}function be(e){return fetch(e,{headers:new Headers({"Content-Type":"application/json"}),method:"GET",credentials:"include"})}function ke(e,t){const n=new FormData;return Object.entries(t).forEach(n.append),fetch(e,{method:"POST",body:n})}async function _e(e){const t=await fetch(e);if(t.ok){const e=await t.blob();return{blob:e,objectURL:URL.createObjectURL(e)}}throw new Error("blobFetch failed")}async function xe(e,t){const n=await async function(e){return new Promise(((t,n)=>{const o=new Image;o.onload=()=>t(o),o.onerror=n,o.src=e}))}(e);t=t||512;const o=document.createElement("canvas"),s=o.getContext("2d"),[i,r]=function(e,t,n){if(e>n||t>n){const o=n/Math.max(e,t);return[e*o,t*o]}return[e,t]}(n.width,n.height,t);return o.width=i,o.height=r,s.drawImage(n,0,0,i,r),o}function Ee(e){const t=e.replace(/^.*[\\\/]/,"").split("?")[0];return{filename:t,ext:t.split(".").pop()}}async function Te(e,{top:t,left:n}={}){if(!Me.has(e)){const o=new Le(e,t,n);return Me.set(e,o),new Promise((e=>{o.onend=e,o.start()}))}Me.get(e).update_target({top:t,left:n})}const Me=new WeakMap;class Le{constructor(e,t,n){this.container=e,this.target={top:t,left:n},this.startContext={startTop:e.scrollTop,startLeft:e.scrollLeft},this.startTime=performance.now(),this.onend=null,this.duration=200}update_target({top:e,left:t}){void 0!==e&&(this.target.top=e),void 0!==t&&(this.target.left=t),this.startContext={startTop:this.container.scrollTop,startLeft:this.container.scrollLeft},this.startTime=performance.now()}frame(){const e=performance.now()-this.startTime,{top:t,left:n}=this.target,{startTop:o,startLeft:s}=this.startContext,i="easeInOutQuad";e<this.duration?(this.container.scrollTop=Se[i](e,o,t-o,this.duration),this.container.scrollLeft=Se[i](e,s,n-s,this.duration),requestAnimationFrame(this.frame.bind(this))):(this.container.scrollTop=t,this.container.scrollLeft=n,Me.delete(this.container),this.onend())}start(){requestAnimationFrame(this.frame.bind(this))}}const Se={easeInOutQuad:(e,t,n,o)=>(e/=o/2)<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t,easeInQuad:(e,t,n,o)=>n*((e/=o)*e)+t,easeOutQuad:(e,t,n,o)=>-n*((e/=o)*e*e(e-2)+1)+t,easeBounce:(e,t,n,o)=>e<o/2.75?n*(7.5625*e*e)/(o*o)+t:e<o/2?n*(7.5625*(e-o/3)*(e-o/3))/(o*o)+t:e<o-o/29?n*(7.5625*(e-o/2.75)*(e-o/2.75))/(o*o)+t:n*(7.5625*(e-o)*(e-o))/(o*o)+t},Pe={forQuery:C,setProps:O,events:function(e,t,n,o={}){t.split(" ").forEach((t=>e.addEventListener(t,n,o)))},delay:D,clearDelay:A,delayChain:S,breakDelayChain:P,debounce:z,of:(e,t)=>Array(e).fill().map(((e,n)=>t(n)))};function De(e){return new Proxy(Pe,{get:(t,n)=>{if(t.hasOwnProperty(n)){const o=t[n];return(...t)=>o(e,...t)}throw new Error(`zyX().${n} is not a function`)}})}function Ae(){return navigator.maxTouchPoints>0}return t})()));