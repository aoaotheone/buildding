import * as THREE from "../libs/three.min"


let textloader = new THREE.FontLoader();

export function createFont(that,str,x,y,z,size,height){
  textloader.load('https://aoaotheone.cn/models/fonts/helvetiker_bold.typeface.json',
    //加载好字体后创建三维文字
    function (font) {

      let textgeometry = new THREE.TextGeometry(str, {
        font: font,
        size: size,
        height: height,
        weight: 'bold',
        style: 'italic',
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 2,
        bevelSize: 4,
        bevelSegments: 3
      });
      //创建法向量材质
      let meshMaterial = new THREE.MeshNormalMaterial({
        flatShading: THREE.FlatShading,
        // transparent: true,
        // opacity: 0.9
      });
      let colorMaterial = new THREE.MeshBasicMaterial({
        color: 0xFACB91,
        // vertexColors: 0xff0000
      })
      let normalMaterial = new THREE.MeshPhongMaterial({
        color: 0xFACB91
      })
      // let mesh = new THREE.Mesh(textgeometry, [meshMaterial,colorMaterial]);
      let text = new THREE.Mesh(textgeometry, normalMaterial);
      text.position.set(x, y, z);
      // text.position.set(100, 140, 160);
      text.rotation.set(0, Math.PI/2, 0)
      // console.log(text)
      text.castShadow = true
      text.receiveShadow = true
      that.box.add(text)
      that.quanta = text
      // that.meshs.push(text)
    }
  )
}