import * as THREE from "../libs/three.min"

/**
 *生成楼层
 */
let texture = new THREE.TextureLoader().load('images/bg' + '.png')
let texture1 = new THREE.TextureLoader().load('images/box' + '.jpeg')

export function  makeFloor (w,h,d) {
  let bricks = [
    new THREE.Vector2(0, .666),
    new THREE.Vector2(.5, .666),
    new THREE.Vector2(.5, 1),
    new THREE.Vector2(0, 1)
  ];
  let clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
  let crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
  let stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
  let water = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
  let wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];


  let geometry = new THREE.BoxGeometry(w,h,d)
  geometry.faceVertexUvs[0] = [];

  geometry.faceVertexUvs[0][0] = [ bricks[0], bricks[1], bricks[3] ];
  geometry.faceVertexUvs[0][1] = [ bricks[1], bricks[2], bricks[3] ];

  geometry.faceVertexUvs[0][2] = [ clouds[0], clouds[1], clouds[3] ];
  geometry.faceVertexUvs[0][3] = [ clouds[1], clouds[2], clouds[3] ];

  geometry.faceVertexUvs[0][4] = [ crate[0], crate[1], crate[3] ];
  geometry.faceVertexUvs[0][5] = [ crate[1], crate[2], crate[3] ];

  geometry.faceVertexUvs[0][6] = [ stone[0], stone[1], stone[3] ];
  geometry.faceVertexUvs[0][7] = [ stone[1], stone[2], stone[3] ];

  geometry.faceVertexUvs[0][8] = [ water[0], water[1], water[3] ];
  geometry.faceVertexUvs[0][9] = [ water[1], water[2], water[3] ];

  geometry.faceVertexUvs[0][10] = [ wood[0], wood[1], wood[3] ];
  geometry.faceVertexUvs[0][11] = [ wood[1], wood[2], wood[3] ];

  // console.log(texture)

  let material =  new THREE.MeshPhongMaterial({map: texture1})
  // let material =  new THREE.MeshPhongMaterial({color: 0xffffff})



  let cube = new THREE.Mesh(geometry,material)
  cube.castShadow = true
  cube.receiveShadow = true

  return cube
}


export function base(x,y,z,h,c) {
  let geometry = new THREE.CubeGeometry(x,y,z)
  let material = new THREE.MeshPhongMaterial({
    color: c
  })
  let cube = new THREE.Mesh(geometry,material)
  cube.position.set(300, h, 0)
  cube.castShadow = true
  cube.receiveShadow = true
  return cube

}

export function makeBG() {
  let geometry = new THREE.BoxGeometry(1,4000,8000)
  let matirail = new THREE.MeshPhongMaterial({
    map: texture
  })
  let bg = new THREE.Mesh(geometry,matirail)
  bg.position.set(-4300,-860,0)
  bg.rotation.set(0,0,Math.PI/16)
  return bg
}