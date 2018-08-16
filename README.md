# Angular图片裁剪
Angular 图片裁剪的组件实在是太少了，大多数人都会选择在Angular使用JQuery的图片裁剪插件，
但引入JQuery会相应的增加不少文件大小，这里我推荐大家使用fengyuanchen开源的原生js版本的
[cropperjs](https://github.com/fengyuanchen/cropperjs/blob/master/README.md),
看了cropperjs作者的[vue中的用法](https://fengyuanchen.github.io/photo-editor/)，这里
我就重新整理了下Angular中如何优雅的使用cropperjs,当然更多的cropperjs
的用法，可以查看作者的文档。此案例功能几乎与作者的vue版本一致，只是使用angular来实现的，当然案例也存在一定的兼容性，目前本人在chrome和360安全浏览器的极速模式是可以正常运行的，在火狐
和IE10都会报错。cropperjs上也有提到有转换成ts版本的，目前没有进行更多的测试，大家可以[参考下](https://github.com/matheusdavidson/angular-cropperjs)

## 希望喜欢的朋友start下   ^=^  ^=^  ^=^

### [在线预览](https://freezyh.github.io/angular-cropper/dist/angular-cropper/)


如下是我新建项目的步骤，具体请看源码

1.创建项目
ng new angular-cropper --style=scss --skip-install

2.进入项目，安装依赖包
cd angular-croppper
yarn install

3.修改package.json,默认浏览器自动打开
"start": "ng serve --open"

4.运行
npm start


angular6在没有使用cropperjs之前，先打包看下文件多大
ng build --prod --aot
总大小：234kb左右

1.引入 cropperjs

yarn add cropperjs

2.修改angular.json

"styles": [
    "./node_modules/cropperjs/dist/cropper.min.css",
    "src/styles.scss"
],
"scripts": [
    "./node_modules/cropperjs/dist/cropper.js"
]

3.创建三个组件,一个服务

ng g c editor --spec=false
ng g c loader --spec=false
ng g c navbar --spec=false

ng g s service/sharedata --spec=false

4.注意index.html和styles.scss，更多查看代码^=^  ^=^  ^=^

再打包看下文件大小
291kb左右
仅仅多了60kb左右，如果引入了jquery版本估计还更多，完美集成原生cropper.js  ^=^  ^=^  ^=^

