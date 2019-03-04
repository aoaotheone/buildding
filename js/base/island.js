import * as THREE from "../libs/three.min";
import "../libs/ColladaLoader"

export function createIsland(that) {
  let loader = new THREE.ColladaLoader()
// loader.load('https://aoaotheone.cn/models/stormtrooper.dae',function (collada) {
  loader.load(that.fileUrl+'/models/sea.dae',function (collada) {
    // let animations = collada.animations;
    let avatar = collada.scene
    // console.log(collada)
    for(let i = 0;i < avatar.children.length;i++){
      avatar.children[i].castShadow = true
      avatar.children[i].receiveShadow = true
      for (let j = 0;j < avatar.children[i].children.length;j++) {
        avatar.children[i].children[j].castShadow = true
        avatar.children[i].children[j].receiveShadow = true
      }
    }
    avatar.position.set(-140,-95,1070)
    avatar.scale.set(14,14,14)
    avatar.castShadow = true
    avatar.receiveShadow = true
    avatar.rotation.set(0,Math.PI/2,0)
    avatar.add(createWater())
    that.island = avatar
    that.box.add(avatar)
    // console.log(avatar)
  })
}
function createWater() {
  let texture = new THREE.TextureLoader().load('images/water.png')
  let geometry = new THREE.CylinderGeometry(54,0,50,200)
  let material = new THREE.MeshPhongMaterial({
    // color: 0x00ffff,
    transparent: true,
    // opacity: 0.4,
    map: texture,
    alphaTest: 0.1
  })
  let mesh = new THREE.Mesh(geometry,material)
  mesh.position.x = 75
  mesh.position.y = -22
  mesh.position.z = -15
  mesh.rotation.y = Math.PI
  // mesh.rotation.z = -Math.PI/128
  return mesh
}