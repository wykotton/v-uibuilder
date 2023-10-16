const path = require('path')
const fs = require("fs")
const http = require('http')
const createHandler = require('gitlab-webhook-handler')
const handler = createHandler({ path: '/webhook' })
const projectPath = '../'

http.createServer(function (req, res) {
  handler(req, res, async function (err) {
    res.statusCode = 404
    res.end('no such location2')


    const commits = [
      {
        "id": "6e22aef99a3762b59e1ac91e006c85f72d444447",
        "message": "Merge branch 'dev' into release\n",
        "title": "Merge branch 'dev' into release",
        "timestamp": "2023-04-07T13:48:45+08:00",
        "url": "http://192.168.21.46:5080/gitlab-instance-f34eb8d7/v-uibuilder/-/commit/6e22aef99a3762b59e1ac91e006c85f72d444447",
        "author": {
          "name": "duoduo",
          "email": "[REDACTED]"
        },
        "added": [
          "docs/guide/extension-example.md",
          "docs/public/assets/component-model/ComponentModel.d.ts",
          "docs/public/assets/component-model/ComponentModel.js",
          "docs/public/images/extension-example/1676442774827.jpg",
          "docs/public/images/extension-example/1676443254737.jpg",
          "docs/public/images/extension-example/1676444182818.jpg",
          "packages/runtime-core/test/designer/aligntools/alignTools.test.ts"
        ],
        "modified": [
          "docs/.vitepress/config/guide.json",
          "packages/v-component/src/components/q-drawer/q-drawer.ts",
          "packages/v-component/src/components/q-modal/q-modal.ts",
          "packages/v-component/src/components/q-split-panes/component.ts",
          "packages/v-component/src/components/q-split-panes/panesItem.vue",
          "packages/v-component/src/components/q-split-panes/q-split-panes.ts",
          "packages/v-component/src/components/q-tablely/component.ts",
          "packages/v-component/src/components/q-tablely/index.scss",
          "packages/v-uibuilder-server/public/log/logs.log",
          "packages/v-uibuilder-server/public/log/logs.log.0",
          "packages/v-uibuilder-server/public/log/logs.log.1",
          "packages/v-uibuilder-server/public/log/logs.log.2",
          "packages/v-uibuilder/src/types/components.d.ts",
          "packages/v-uibuilder/src/utils/designer/EventBus.ts"
        ],
        "removed": [
  
        ]
      },
      {
        "id": "14ba3c6ebd81fdc6e2356289b882b5ce6b62ef7f",
        "message": "Merge branch 'qianchang-dev' into dev\n",
        "title": "Merge branch 'qianchang-dev' into dev",
        "timestamp": "2023-04-07T13:46:43+08:00",
        "url": "http://192.168.21.46:5080/gitlab-instance-f34eb8d7/v-uibuilder/-/commit/14ba3c6ebd81fdc6e2356289b882b5ce6b62ef7f",
        "author": {
          "name": "duoduo",
          "email": "[REDACTED]"
        },
        "added": [
          "docs/guide/extension-example.md",
          "docs/public/assets/component-model/ComponentModel.d.ts",
          "docs/public/assets/component-model/ComponentModel.js",
          "docs/public/images/extension-example/1676442774827.jpg",
          "docs/public/images/extension-example/1676443254737.jpg",
          "docs/public/images/extension-example/1676444182818.jpg",
          "packages/runtime-core/test/designer/aligntools/alignTools.test.ts"
        ],
        "modified": [
          "docs/.vitepress/config/guide.json",
          "packages/v-uibuilder/src/utils/designer/EventBus.ts"
        ],
        "removed": [
  
        ]
      },
      {
        "id": "c7aa65c52f8d9241eb1ef3702399214dabe8fd56",
        "message": "feat: 提交对其工具测试文件\n",
        "title": "feat: 提交对其工具测试文件",
        "timestamp": "2023-04-07T13:45:35+08:00",
        "url": "http://192.168.21.46:5080/gitlab-instance-f34eb8d7/v-uibuilder/-/commit/c7aa65c52f8d9241eb1ef3702399214dabe8fd56",
        "author": {
          "name": "duoduo",
          "email": "[REDACTED]"
        },
        "added": [
          "packages/runtime-core/test/designer/aligntools/alignTools.test.ts"
        ],
        "modified": [
  
        ],
        "removed": [
  
        ]
      }
    ]
    const iteratorModel = ['added', 'modified', 'removed']
    // packages/v-component/src/components/q-affix
    for (let i = 0; i < commits.length; i++) {
      const updataComponents = {}
      const commitsItem = commits[i]
      const message = commitsItem.message
      for (let j = 0; j < iteratorModel.length; j++) {
        for (let k = 0; k < commitsItem[iteratorModel[j]].length; k++) {
          const addItem = commitsItem[iteratorModel[j]][k];
          const component = addItem.match(/packages\/v-component\/src\/components\/(.*)\//)
          if (component) {
            const componentName = component[1]
            if (updataComponents[componentName]) {
              if ('added|modified'.indexOf(iteratorModel[j]) !== -1) updataComponents[componentName]['cover'].push(addItem)
              if ('removed'.indexOf(iteratorModel[j]) !== -1) updataComponents[componentName]['remove'].push(addItem)
            } else {
              updataComponents[componentName] = {}
              if ('added|modified'.indexOf(iteratorModel[j]) !== -1) {
                updataComponents[componentName]['cover'] = [addItem]
                updataComponents[componentName]['remove'] = []
                updataComponents[componentName]['message'] = message
              }
              if ('removed'.indexOf(iteratorModel[j]) !== -1) {
                updataComponents[componentName]['cover'] = []
                updataComponents[componentName]['remove'] = [addItem]
                updataComponents[componentName]['message'] = message
              }
            }
          }
        }
      }
      const componentKey = Object.keys(updataComponents)
      for (let x = 0; x < componentKey.length; x++) {
        const key = componentKey[x];
        const keyDir = updataComponents[key].cover[0] || updataComponents[remove].cover[0]
        
        const yjArr = keyDir.split(`/${key}/`)
        // 寻找版本号
        const yjDir = `${projectPath}${yjArr[0]}/${key}/`
        let dirPath = path.resolve(__dirname, yjDir);
        let files = fs.readdirSync(dirPath); // 该文件夹下的所有文件名称 (文件夹 + 文件)
        console.log(files)
        let version = '1.0.0'
        const versionFile = files.filter(v => v.substring(0, 8) === 'version_')
        // 处理版本号
        if (versionFile.length) {
          version = versionFile[0].substring(8)
          // fs.rename(`${yjDir}${versionFile[0]}`, `./warehouse/${key}/${versionFile[0]}/${yjPath}`,(err)=>{
          //   if(err){
          //     console.log('出错')
          //   }else{
          //     console.log('未出错')
          //   }
          // })
        } else {
          await fs.writeFileSync(`${yjDir}version_${version}`, '', {encoding: 'utf-8', flag: 'w'});
        }

        for (let y = 0; y < updataComponents[key].cover.length; y++) {
          const yjPath = yjArr[1]
          const cover = updataComponents[key].cover[y];
          // const fromFileName = path.resolve(__dirname, `${projectPath}${cover}`);
          // const toFileName = path.resolve(__dirname, `./warehouse/${key}${yjPath}`);

          await creatFile(`${projectPath}${cover}`, `./warehouse/${key}/${version}/${yjPath}`)
          // 执行建立需要储存的数据文件夹
          // try {
          //   await Folder(`./warehouse/${key}${yjPath}`);
          // } catch (err) {
          //   console.log(err);
          // }
          // await fs.copyFile(fromFileName, toFileName, 0, (err)=>{
          //     console.log(err)
          // })
        }
      }
    }






  })
}).listen(5999)
 
console.log("Gitlab Hook Server running at http://0.0.0.0:5999/webhook");

// const Folder = async (reaPath) => {
//   const absPath = path.resolve(__dirname, reaPath);
//   try {
//     await fs.promises.stat(absPath);
//   } catch (e) {
//     // {recursive: true} 这个配置项是配置自动创建多层文件夹
//     await fs.promises.mkdir(absPath, { recursive: true });
//   }
// };

const creatFile = async function (from, to) {
  console.log(from, to)
  const fromFileName = path.resolve(__dirname, from);
  const toFileName = path.resolve(__dirname, to);
  const dirArr = to.split("/");
  // console.log(to)
  for (let i = 0; i < dirArr.length; i++) {
    // console.log(dirArr[i])
    if (i == dirArr.length - 1) {
      if(!!dirArr[i].match(/\./g)){
          if(!fs.existsSync(to)){
            await fs.copyFile(fromFileName, toFileName, 0, (err)=>{
                // console.log(err)
                if(err){
                    return console.log("文件：" + toFileName + "创建失败");
                }else{
                    return console.log("文件：" + toFileName + "创建成功");
                }
            })
          }
      }
    }else {
      const munstr = dirArr.slice(0, i+1).join("/");
      if(!fs.existsSync(munstr)){
        await fs.mkdirSync(munstr)
      }
    }
  }
};

handler.on('error', function (err) {
  	console.error('Error:', err.message)
})

handler.on('push', async function (event) {
  	console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
    const commits = event.payload.commits
    // const commits = [
    //   {
    //     "id": "6e22aef99a3762b59e1ac91e006c85f72d444447",
    //     "message": "Merge branch 'dev' into release\n",
    //     "title": "Merge branch 'dev' into release",
    //     "timestamp": "2023-04-07T13:48:45+08:00",
    //     "url": "http://192.168.21.46:5080/gitlab-instance-f34eb8d7/v-uibuilder/-/commit/6e22aef99a3762b59e1ac91e006c85f72d444447",
    //     "author": {
    //       "name": "duoduo",
    //       "email": "[REDACTED]"
    //     },
    //     "added": [
    //       "docs/guide/extension-example.md",
    //       "docs/public/assets/component-model/ComponentModel.d.ts",
    //       "docs/public/assets/component-model/ComponentModel.js",
    //       "docs/public/images/extension-example/1676442774827.jpg",
    //       "docs/public/images/extension-example/1676443254737.jpg",
    //       "docs/public/images/extension-example/1676444182818.jpg",
    //       "packages/runtime-core/test/designer/aligntools/alignTools.test.ts"
    //     ],
    //     "modified": [
    //       "docs/.vitepress/config/guide.json",
    //       "packages/v-component/src/components/q-drawer/q-drawer.ts",
    //       "packages/v-component/src/components/q-modal/q-modal.ts",
    //       "packages/v-component/src/components/q-split-panes/component.ts",
    //       "packages/v-component/src/components/q-split-panes/panesItem.vue",
    //       "packages/v-component/src/components/q-split-panes/q-split-panes.ts",
    //       "packages/v-component/src/components/q-tablely/component.ts",
    //       "packages/v-component/src/components/q-tablely/index.scss",
    //       "packages/v-uibuilder-server/public/log/logs.log",
    //       "packages/v-uibuilder-server/public/log/logs.log.0",
    //       "packages/v-uibuilder-server/public/log/logs.log.1",
    //       "packages/v-uibuilder-server/public/log/logs.log.2",
    //       "packages/v-uibuilder/src/types/components.d.ts",
    //       "packages/v-uibuilder/src/utils/designer/EventBus.ts"
    //     ],
    //     "removed": [
  
    //     ]
    //   },
    //   {
    //     "id": "14ba3c6ebd81fdc6e2356289b882b5ce6b62ef7f",
    //     "message": "Merge branch 'qianchang-dev' into dev\n",
    //     "title": "Merge branch 'qianchang-dev' into dev",
    //     "timestamp": "2023-04-07T13:46:43+08:00",
    //     "url": "http://192.168.21.46:5080/gitlab-instance-f34eb8d7/v-uibuilder/-/commit/14ba3c6ebd81fdc6e2356289b882b5ce6b62ef7f",
    //     "author": {
    //       "name": "duoduo",
    //       "email": "[REDACTED]"
    //     },
    //     "added": [
    //       "docs/guide/extension-example.md",
    //       "docs/public/assets/component-model/ComponentModel.d.ts",
    //       "docs/public/assets/component-model/ComponentModel.js",
    //       "docs/public/images/extension-example/1676442774827.jpg",
    //       "docs/public/images/extension-example/1676443254737.jpg",
    //       "docs/public/images/extension-example/1676444182818.jpg",
    //       "packages/runtime-core/test/designer/aligntools/alignTools.test.ts"
    //     ],
    //     "modified": [
    //       "docs/.vitepress/config/guide.json",
    //       "packages/v-uibuilder/src/utils/designer/EventBus.ts"
    //     ],
    //     "removed": [
  
    //     ]
    //   },
    //   {
    //     "id": "c7aa65c52f8d9241eb1ef3702399214dabe8fd56",
    //     "message": "feat: 提交对其工具测试文件\n",
    //     "title": "feat: 提交对其工具测试文件",
    //     "timestamp": "2023-04-07T13:45:35+08:00",
    //     "url": "http://192.168.21.46:5080/gitlab-instance-f34eb8d7/v-uibuilder/-/commit/c7aa65c52f8d9241eb1ef3702399214dabe8fd56",
    //     "author": {
    //       "name": "duoduo",
    //       "email": "[REDACTED]"
    //     },
    //     "added": [
    //       "packages/runtime-core/test/designer/aligntools/alignTools.test.ts"
    //     ],
    //     "modified": [
  
    //     ],
    //     "removed": [
  
    //     ]
    //   }
    // ]
    const iteratorModel = ['added', 'modified', 'removed']
    // packages/v-component/src/components/q-affix
    for (let i = 0; i < commits.length; i++) {
      const updataComponents = {}
      const commitsItem = commits[i]
      const message = commitsItem.message
      for (let j = 0; j < iteratorModel.length; j++) {
        for (let k = 0; k < commitsItem[iteratorModel[j]].length; k++) {
          const addItem = commitsItem[iteratorModel[j]][k];
          const component = addItem.match(/packages\/v-component\/src\/components\/(.*)\//)
          if (component) {
            const componentName = component[1]
            if (updataComponents[componentName]) {
              if ('added|modified'.indexOf(iteratorModel[j]) !== -1) updataComponents[componentName]['cover'].push(addItem)
              if ('removed'.indexOf(iteratorModel[j]) !== -1) updataComponents[componentName]['remove'].push(addItem)
            } else {
              updataComponents[componentName] = {}
              if ('added|modified'.indexOf(iteratorModel[j]) !== -1) {
                updataComponents[componentName]['cover'] = [addItem]
                updataComponents[componentName]['remove'] = []
                updataComponents[componentName]['message'] = message
              }
              if ('removed'.indexOf(iteratorModel[j]) !== -1) {
                updataComponents[componentName]['cover'] = []
                updataComponents[componentName]['remove'] = [addItem]
                updataComponents[componentName]['message'] = message
              }
            }
          }
        }
      }
      const componentKey = Object.keys(updataComponents)
      for (let x = 0; x < componentKey.length; x++) {
        const key = componentKey[x];
        for (let y = 0; y < updataComponents[key].cover.length; y++) {
          const cover = updataComponents[key].cover[y];
          const yjPath = cover.split(`/${key}/`).at(-1)
          // const fromFileName = path.resolve(__dirname, `${projectPath}${cover}`);
          // const toFileName = path.resolve(__dirname, `./warehouse/${key}${yjPath}`);
          // 寻找版本号
          let dirPath = path.resolve(__dirname, dir);
          let files = fs.readdirSync(dirPath); // 该文件夹下的所有文件名称 (文件夹 + 文件)


          await creatFile(`${projectPath}${cover}`, `./warehouse/${key}/${yjPath}`)
          // 执行建立需要储存的数据文件夹
          // try {
          //   await Folder(`./warehouse/${key}${yjPath}`);
          // } catch (err) {
          //   console.log(err);
          // }
          // await fs.copyFile(fromFileName, toFileName, 0, (err)=>{
          //     console.log(err)
          // })
        }
      }
    }
})

handler.on('issues', function (event) {
  	console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})