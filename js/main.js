// 导入一个 SCSS module
import '../css/main.scss';

import { data, preData } from './data'

import { TweenMax, TweenLite, TimelineMax } from 'gsap'

// NodeList转换Array
function NodeList2Array(nodelist) {
    let arr = [];
    if (nodelist.length > 0) {
        arr = Array.prototype.slice.call(nodelist, 0);
    }
    return arr;
}
// 把'clip-path'值转成svg polygon可用的值
function parsePolygonStr(polygonStr, width, height) {
    let pointsArr = polygonStr.split(/\s+|,\s/);
    let newPointArr = pointsArr.map(function(currentVal, index, arr) {
        if (index % 2 === 0) {
            return (parseFloat(currentVal) * width / 100).toFixed(2);
        } else {
            return (parseFloat(currentVal) * height / 100).toFixed(2);
        }
    });

    return newPointArr;
}



let body = document.querySelector('body'),
    wrap = document.querySelector('#wrap'),
    name = wrap.querySelector('.name'),
    desc = wrap.querySelector('.desc'),
    stage = wrap.querySelector('.stage'),
    anis = document.querySelector('#anis'),
    extra = document.querySelector('#extra'),
    goBtn = document.querySelector('#go_btn'),
    anisPolygons = null,
    extraPolygons = null;


let currentSpeciesIndex = 0,
    width = 1000,
    height = 700;


function init() {
    let initSpecies = preData.preload;
    name.innerHTML = initSpecies.name;
    desc.innerHTML = initSpecies.desc;
    body.style.background = initSpecies.background;

    let polygonArr = initSpecies.polygon;

    if (Object.prototype.toString.call(polygonArr) === '[object Array]') {
        let polygonHtml = '';

        polygonArr.forEach(function(element, index) {
            let pointsVal = parsePolygonStr(element[0], width, height);
            polygonHtml += '<polygon points="' + pointsVal + '" fill="' + element[1] + '"/>';
        });
        anis.innerHTML = polygonHtml;

    }
}
init();
anisPolygons = anis.querySelectorAll('polygon');
extraPolygons = extra.querySelectorAll('polygon');

let tl = new TimelineMax({ delay: 0.2 });
// 初始的loading动画
NodeList2Array(anisPolygons).forEach(function(target, index) {
    let tm = TweenMax.fromTo(target, 0.9, { attr: { fill: 'rgba(0, 0, 0, .7)' } }, { attr: { fill: 'rgba(200, 20, 20, .45)' }, ease: Power0.easeNone, repeat: -1, yoyo: true });
    tl.add(tm, 0.9 - 0.03 * index);
})

// 模拟加载完成
setTimeout(function() {
    // 清除tl
    tl.clear();
    // loading完之后的一系列动画
    // 1，变色，放大，爆炸碎片
    tl.add(
            [
                TweenMax.to('#anis polygon', .6, {
                    attr: {
                        fill: function(index) {
                            let fillVal = '#111';
                            if (index % 5 === 0) {
                                fillVal = '#28282a';
                            } else if (index % 5 === 1) {
                                fillVal = '#111';
                            } else if (index % 5 === 2) {
                                fillVal = '#333';
                            } else if (index % 5 === 3) {
                                fillVal = '#222';
                            } else if (index % 5 === 4) {
                                fillVal = '#121212';
                            }
                            return fillVal;
                        }
                    }
                }),
                TweenMax.to('#wrap .stage', .6, {
                    scale: 1,
                    ease: Back.easeOut.config(1.7)
                }),
                TweenMax.to('#anis polygon', .6, {

                    attr: {
                        points: function(index, target) {
                            let nextSpeciesPolygon = preData.ready.polygon;
                            // debugger
                            return parsePolygonStr(nextSpeciesPolygon[index][0], width, height)
                        },
                        fill: function(index, target) {
                            let nextSpeciesPolygon = preData.ready.polygon;
                            return nextSpeciesPolygon[index][1];
                        },
                    }
                    // ease: Power2.easeInOut,

                })
            ]
        )
        // 2，海豚
        .add(
            TweenLite.to('#anis polygon', .6, {

                attr: {
                    points: function(index, target) {
                        let nextSpeciesPolygon = preData.preAni.polygon;
                        return parsePolygonStr(nextSpeciesPolygon[index][0], width, height)
                    },
                    fill: function(index, target) {
                        let nextSpeciesPolygon = preData.preAni.polygon;
                        return nextSpeciesPolygon[index][1];
                    },
                },
                // ease: Power2.easeInOut,
            })
        )
        // 3，爆炸碎片
        .add(
            TweenMax.to('#anis polygon', .6, {

                attr: {
                    points: function(index, target) {
                        let nextSpeciesPolygon = preData.ready.polygon;
                        // debugger
                        return parsePolygonStr(nextSpeciesPolygon[index][0], width, height)
                    },
                    fill: function(index, target) {
                        let nextSpeciesPolygon = preData.ready.polygon;
                        return nextSpeciesPolygon[index][1];
                    },
                }
            }),
            '+=0.4'
        )
        // 4，“piece”logo
        .add(
            TweenMax.to('#anis polygon', .6, {

                attr: {
                    points: function(index, target) {
                        let nextSpeciesPolygon = preData.title.polygon;
                        // debugger
                        return parsePolygonStr(nextSpeciesPolygon[index][0], width, height)
                    },
                    fill: function(index, target) {
                        let nextSpeciesPolygon = preData.title.polygon;
                        return nextSpeciesPolygon[index][1];
                    },
                }
            }),
            '+=0.4'
        );

}, 3000);



// 动物图案切换
function playHandler() {
    let nextSpecies = data[currentSpeciesIndex++];
    if (!nextSpecies) {
        return false;
    }

    name.innerHTML = nextSpecies.name;
    desc.innerHTML = nextSpecies.desc;
    body.style.background = nextSpecies.background;

    let nextSpeciesPolygon = nextSpecies.polygon;

    let subTl = new TimelineMax({ pause: true });

    let arr1 = NodeList2Array(anisPolygons);
    let arr2 = NodeList2Array(extraPolygons);

    // 之所以没用TweenMax.staggerTo是因为属性对象中没法用获得index，如下实现不了
    // attr: {
    //     points: pointVal.join(' '),
    //     fill: function(index){return nextSpeciesPolygon[index][1];}
    // }

    arr1.concat(arr2).forEach(function(target, index) {
        let pointVal = parsePolygonStr(nextSpeciesPolygon[index][0], width, height),
            fillVal = nextSpeciesPolygon[index][1];
        subTl.add(
            TweenMax.to(target, 0.5, {
                attr: {
                    points: pointVal.join(' '),
                    fill: fillVal
                },
                ease: Back.easeOut.config(1.7)
            }),
            '-=0.47'
        )
    });

    subTl.play();


}

goBtn.addEventListener('click', playHandler, false);


export default () => {

};