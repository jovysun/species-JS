# species-JS
> 关键词：svg   GSAP    JS动画
## 出发点
看着[species-in-pieces网站](http://species-in-pieces.com/)做的动物图案动效挺好的，可是用的是css3的-webkit-clip-path实现的，兼容不太好，就想着用js动画库[GSAP](https://greensock.com/)实现下，当然各种动画细节等还需进一步完善，主要目的是作为学习JS实现SVG动画。

## 效果查看
切下文件直接打开build中index.html查看。

## 本地运行
1. 因为用parcel(快速，零配置的 Web 应用程序打包器)构建的，所以需要装下[parcel](http://www.css88.com/doc/parcel/)环境；
2. 环境好了，直接在根目录执行`parcel index.html`，默认的就可以访问`http://localhost:1234/`查看效果了。

## 学习引导
1. 入口文件index.html和index.js；
2. 主要业务代码在main.js中，data.js是species网站的设计图形数据；
3. 详细的见博文[xxx]()。