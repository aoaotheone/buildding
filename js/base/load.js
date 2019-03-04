
const fileUrl = wx.env.USER_DATA_PATH
const fs = wx.getFileSystemManager()

let phone = wx.getSystemInfoSync()
export function load(three){
  fs.mkdir({
    dirPath: fileUrl + '/models',
    success: function (res) {
      // console.log(res)
    },
    fail: function (res) {
      // console.log(res)
    }
  })


  // fs.readdir({
  //   dirPath: fileUrl,
  //   success: function (res) {
  //     console.log(res)
  //   },
  //   fail: function (res) {
  //     console.log(res)
  //   }
  // })

  fs.unlink({
    filePath: fileUrl + '/models/sea.dae',
    success: function (res) {
      // console.log(res)
    },
    fail: function (res) {
      // console.log(res)
    }
  })


  fs.readFile({
    filePath: fileUrl + '/models/sea.dae',
    success: function (res) {
      // console.log(res)
      three.loaded = true
    },
    fail: function (res) {
      let downloadTask = wx.downloadFile({
        url: 'https://aoaotheone.cn/models/sea.dae',
        success: function (res) {
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            filePath: fileUrl + '/models/sea.dae',
            success: function (res) {
              // console.log(res)
              // let game = new Main()
            }
          })
        }
      })
      downloadTask.onProgressUpdate(function(res){
        // console.log(res.progress) //0~100
        if (three.loadHub){
          three.loadHub.children[0].children[0].scale.set(1,1,res.progress*2)
          if (phone.model === 'iPhone 6s<iPhone8,1>'){
            three.loadHub.children[0].children[0].position.z -= 2.5
          } else {
            three.loadHub.children[0].children[0].position.z -= 0.5
          }
          // three.loadHub.children[0].children[0].position.z -= 0.55
        }
        if(res.progress === 100){
          // console.log(three.loadHub)
          // console.log(three.loadHub.children)

          three.loaded = true
        }
      })
    }
  })
}

