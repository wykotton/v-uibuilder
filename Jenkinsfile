#!groovy
def MODULES = [
        'h5': [
                path: ['main':'./projects/main/dist','login':'./projects/login/dist','home':'./projects/home/dist'],
                folder: ['main':'/.','login':'/login','home':'/home'],
                servers: [
                        'dev': ['172.20.8.94'],
                        'sit': ['172.20.11.83'],
                        'sit-https': ['172.20.11.83'],
                        'uat': ['172.20.14.43'],
                        'pre': ['172.20.8.12'],
                        'prod': [''],
                        'other': [''],
                        'mini-dev': ['172.20.8.94'],
                        'mini-sit': ['172.20.11.83'],
                        'mini-prod': [],
                        'alipay-sit': ['172.20.11.83'],
                        'alipay-prod': []
                ]
        ]
]

def nameList = ['h5']

def buildStages = [:]
def sonarStages = [:]
def packageStages = [:]
def deployStages = [:]
def releaseStages = [:]

def deployFrontEnd(ipAddress, backupName, packageName, deployFolder) {
  sh "ssh -p 2222 -i ~/.ssh/scp_key_rsa vipxf@${ipAddress} 'mkdir -p backup && mkdir -p /home/vipxf/application/${deployFolder} && tar -zcvf ${backupName} -C /home/vipxf/application/${deployFolder} . && mv ${backupName} backup'"
  sh "ssh -p 2222 -i ~/.ssh/scp_key_rsa vipxf@${ipAddress} 'rm -rf /home/vipxf/application/${deployFolder} && mkdir -p /home/vipxf/application/${deployFolder}'"
  sh "scp -P 2222 -i ~/.ssh/scp_key_rsa ${packageName} vipxf@${ipAddress}:/home/vipxf/application/${deployFolder}"
  sh "ssh -p 2222 -i ~/.ssh/scp_key_rsa vipxf@${ipAddress} 'cd /home/vipxf/application/${deployFolder} && tar -xzvf ${packageName} && rm -f ${packageName}'"
}

def setBuildStatus(projectId, commitId, status, token) {
  def respStatus = sh(returnStdout: true, script: "curl -ssL -w '%{http_code}' -o /dev/null -X POST -H 'PRIVATE-TOKEN: ${token}' http://gitlab01.vfcf.com/api/v4/projects/${projectId}/statuses/${commitId}?state=${status}").trim()
  if (respStatus == 200 || respStatus == 201) {
    echo '更新状态成功'
  } else {
    echo '更新状态成功'
  }
}

pipeline {
  agent {
    node {
      label 'docker-env'
    }
  }
  libraries {
    lib('pipelineLibs')
  }
  environment {
    PACKAGE_VERSION = ''
    PACKAGE_NAME_POST_FIX = '-frontend.tar.gz'
    BACKUP_PACKAGE_NAME_POST_FIX = '-frontend-bak.tar.gz'
    PROJECT_KEY = 'be702758-94d5-42b0-9ff5-9ea601a32f3c'
    PROJECT_NAME = 'h5-ui'
    SONAR_HOST_URL = '172.20.8.99:9000'
    SONAR_LOGIN = '5e41d9c0603a0ce6d040245307af76a9fcf70abb'
    GITLAB_TOKEN = 'K_EUJsUzhaMpM_s6CoUB'
    GITLAB_PROJECT_ID = '115'
    GITLAB_COMMIT_ID = ''
    GIT_VERSION = ''
    BAIRONG_SDK = 'brcore-v5.0.0-dev.min.js'
    BAIRONG_CLIENT_ID = '3031220'
    DATA_CAPTURE_URL = 'http://172.20.8.117:10001'
    RELEASE_VERSION = ''
    VIPXF_UID = 'be702758-94d5-42b0-9ff5-9ea601a32f3d'
    VIPXF_HOST = 'https://xrh.vipxf.com'
    VIPXF_ACTIVITY_HOST = 'https://a.vipxf.com'
    SOURCE_TYPE = 'package'
    DEPLOY_TERMINAL = 'web'
    DEPLOY_FOLDER = 'vipxf-h5-ui-v2'
  }
  options {
    timestamps()
    timeout(300) //默认单位分，指定单位 timeout(time: 2, unit: 'SECONDS')
    disableConcurrentBuilds() //禁止并行构建
    buildDiscarder logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '3')
  }
  parameters {
    choice name: 'ACTION', choices: ['build', 'deploy', 'release'], description: 'build: 自动触发时的默认选项，只构建到service层, deploy: 构建并部署到目标服务器, release: 发布版本不会进行任何部署，只打包'
    choice name: 'MODULE_NAME', choices: nameList, description: "指定本次要部署的模块"
    choice name: 'DEPLOY_TO', choices: ["dev", "sit", "sit-https", "uat", "pre", 'prod', 'other', 'mini-dev', 'mini-sit', 'mini-prod', 'alipay-sit', 'alipay-prod'], description: "指定目标服务器,如果部署到非预订环境,请在下面填写目标ip,并需要预先联系配置ssh key"
    booleanParam name: 'FORCE_MERGE', defaultValue: false, description: '是否自动合并，建议每次尝试自动合并'
    string name: 'SPECIFIC_IP', defaultValue: '', description: "指定环境ip地址，端口默认使用2222 -i ~/.ssh/scp_key_rsa，用户默认vipxf", trim: true
  }
  triggers {
    GenericTrigger(
            genericVariables: [
                    [key: 'branchname', value: '$.ref'],
                    [key: 'msg', value: '$.commits[0].message'],
                    [key: 'user', value: '$.commits[0].author.name || $.user_name'],
            ],
            causeString: '$msg, push by $user',
            token: 'h5-frontend',
            printContributedVariables: true,
            printPostContent: true,

            silentResponse: false,

            regexpFilterText: '$branchname',
            regexpFilterExpression: '^refs/heads/' + BRANCH_NAME
    )
  }
  stages {
    stage('set pending status') {
      steps {
        script {
          GITLAB_COMMIT_ID = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
          setBuildStatus("${GITLAB_PROJECT_ID}", "${GITLAB_COMMIT_ID}", "pending", "${GITLAB_TOKEN}")
          // TODO read project version here
        }
      }
    }

    stage('init') {
      parallel {
        stage('config') {
          steps {
            script {
              if (params.DEPLOY_TO == 'prod') {
                BAIRONG_SDK = "brcore-v5.0.0.min.js"
                BAIRONG_CLIENT_ID = "3031220"
                DATA_CAPTURE_URL = "https://df.vipxf.com"
                SOURCE_TYPE = 'package'
              }
              if (params.DEPLOY_TO == 'uat') {
                DATA_CAPTURE_URL = "http://172.20.11.171:10001"
                VIPXF_HOST = "http://172.20.6.107"
                VIPXF_ACTIVITY_HOST = "http://172.20.6.107"
                SOURCE_TYPE = 'package'
              }
              if (params.DEPLOY_TO == 'sit-https') {
                DATA_CAPTURE_URL = "https://xrh-test.vfcf.cn:15443/ets"
                VIPXF_HOST = "https://xrh-test.vfcf.cn:15443"
                VIPXF_ACTIVITY_HOST = "https://a.vfcf.cn:15445"
                SOURCE_TYPE = 'package'
              }
              if (params.DEPLOY_TO == 'sit' || params.DEPLOY_TO == 'pre') {
                DATA_CAPTURE_URL = "http://172.20.11.171:10001"
                VIPXF_HOST = "http://172.20.6.94"
                VIPXF_ACTIVITY_HOST = "http://172.20.6.94"
                SOURCE_TYPE = 'package'
              }
              if (params.DEPLOY_TO == 'dev') {
                VIPXF_HOST = "http://172.20.6.91"
                VIPXF_ACTIVITY_HOST = 'http://172.20.6.91'
                SOURCE_TYPE = 'package'
              }
              if (params.DEPLOY_TO == 'mini-prod') {
                BAIRONG_SDK = "brcore-v5.0.0.min.js"
                BAIRONG_CLIENT_ID = "3031220"
                DATA_CAPTURE_URL = "https://df.vipxf.com"
                VIPXF_HOST = "https://mp.vipxf.com"
                SOURCE_TYPE = 'package'
                PROJECT_NAME = 'h5-ui-mini'
                DEPLOY_FOLDER = 'vipxf-h5-ui-mini'
                DEPLOY_TERMINAL = 'mini'
              }
              if (params.DEPLOY_TO == 'mini-sit') {
                BAIRONG_SDK = "brcore-v5.0.0-dev.min.js"
                BAIRONG_CLIENT_ID = "3031220"
                DATA_CAPTURE_URL = "https://mp-test.vipxf.com/ets"
                VIPXF_HOST = "https://mp-test.vipxf.com"
                VIPXF_ACTIVITY_HOST = "https://mp-test.vipxf.com"
                SOURCE_TYPE = 'package'
                PROJECT_NAME = 'h5-ui-mini'
                DEPLOY_FOLDER = 'vipxf-h5-ui-mini'
                DEPLOY_TERMINAL = 'mini'
              }
              if (params.DEPLOY_TO == 'mini-dev') {
                BAIRONG_SDK = "brcore-v5.0.0-dev.min.js"
                BAIRONG_CLIENT_ID = "3031220"
                DATA_CAPTURE_URL = "http://172.20.11.171:10001"
                VIPXF_HOST = "http://172.20.6.91"
                VIPXF_ACTIVITY_HOST = 'http://172.20.6.91'
                SOURCE_TYPE = 'package'
                PROJECT_NAME = 'h5-ui-mini'
                DEPLOY_FOLDER = 'vipxf-h5-ui-mini'
                DEPLOY_TERMINAL = 'mini'
              }
              if (params.DEPLOY_TO == 'alipay-prod') {
                BAIRONG_SDK = "brcore-v5.0.0.min.js"
                BAIRONG_CLIENT_ID = "3031220"
                DATA_CAPTURE_URL = "https://df.vipxf.com"
                VIPXF_HOST = "https://alipay.vipxf.com"
                SOURCE_TYPE = 'package'
                PROJECT_NAME = 'h5-ui-alipay'
                DEPLOY_FOLDER = 'vipxf-h5-ui-alipay'
                DEPLOY_TERMINAL = 'alipay'
              }
              if (params.DEPLOY_TO == 'alipay-sit') {
                BAIRONG_SDK = "brcore-v5.0.0-dev.min.js"
                BAIRONG_CLIENT_ID = "3031220"
                DATA_CAPTURE_URL = "https://alipay-test.vfcf.cn/ets"
                VIPXF_HOST = "https://alipay-test.vfcf.cn"
                VIPXF_ACTIVITY_HOST = "https://alipay-test.vfcf.cn"
                SOURCE_TYPE = 'package'
                PROJECT_NAME = 'h5-ui-alipay'
                DEPLOY_FOLDER = 'vipxf-h5-ui-alipay'
                DEPLOY_TERMINAL = 'alipay'
              }
              MODULES.each { k, v ->
                if (params.DEPLOY_TO == 'other') {
                  v.servers.other = ["${params.SPECIFIC_IP}"]
                }

                if (params.MODULE_NAME == k) {
                   buildStages[k] = {
                    stage(k) {
                      echo "==================== 开始编译 ${k} ==================== "
                      sh """
                        docker run \
                          --rm \
                          -e BAIRONG_SDK=${BAIRONG_SDK} \
                          -e BAIRONG_CLIENT_ID=${BAIRONG_CLIENT_ID} \
                          -e DATA_CAPTURE_URL=${DATA_CAPTURE_URL} \
                          -e VIPXF_UID=${VIPXF_UID} \
                          -e BUILD_NUMBER=${BUILD_NUMBER} \
                          -e VIPXF_HOST=${VIPXF_HOST} \
                          -e VIPXF_ACTIVITY_HOST=${VIPXF_ACTIVITY_HOST} \
                          -e SOURCE_TYPE=${SOURCE_TYPE} \
                          -e DEPLOY_TERMINAL=${DEPLOY_TERMINAL} \
                          -v "${env.WORKSPACE}:/usr/src" \
                          -v "/tmp/${PROJECT_NAME}:/root/.cache" \
                          -w /usr/src \
                          vipxf/node:14-buster \
                          yarn build:all
                      """
                    }
                  }
                }

                if (params.MODULE_NAME == k) {
                  packageStages[k] = {
                    stage(k) {
                      echo "==================== 开始打包 ${k} ==================== "
                      sh "rm -rf ${k}-${DEPLOY_TERMINAL}${PACKAGE_NAME_POST_FIX} && rm -rf ${env.WORKSPACE}/dist"
                      sh "mkdir -p ${env.WORKSPACE}/dist"
                      v.path.each { p, l ->
                        echo "working path:" + l
                        sh "cp -a ${l}${v.folder[p]} ${env.WORKSPACE}/dist${v.folder[p]}"
                      }
                      sh "tar -czvf ${k}-${DEPLOY_TERMINAL}${PACKAGE_NAME_POST_FIX} -C ${env.WORKSPACE}/dist ."
                    }
                  }
                }

                if (params.MODULE_NAME == k) {
                  deployStages[k] = {
                    stage(k) {
                      echo "==================== 开始部署 ${k} ==================== "
                      for (targetId in v.servers[params.DEPLOY_TO]) {
                        deployFrontEnd(targetId,"${k}-${DEPLOY_TERMINAL}${BACKUP_PACKAGE_NAME_POST_FIX}","${k}-${DEPLOY_TERMINAL}${PACKAGE_NAME_POST_FIX}", "${DEPLOY_FOLDER}")
                      }
                    }
                  }
                }

                if (params.MODULE_NAME == k) {
                  releaseStages[k] = {
                    stage(k) {
                      echo "==================== Release ${k} ==================== "
                      // sh "rm -rf ${RELEASE_VERSION}"
                      // sh "mkdir -p ${RELEASE_VERSION}"
                      // sh "cp -a ${k}${PACKAGE_NAME_POST_FIX} ${RELEASE_VERSION}"
                      // sh "cp -a scripts/execute.sh ${RELEASE_VERSION}"
                      // sh "cp -a scripts/deploy.sh ${RELEASE_VERSION}"
                      // sh "tar -zcf ${RELEASE_VERSION}.tar.gz -C ${RELEASE_VERSION} ."
                      archiveArtifacts(artifacts: "${k}-${DEPLOY_TERMINAL}${PACKAGE_NAME_POST_FIX}", onlyIfSuccessful: true, fingerprint: true)
                      publish project_type: 'vfcf',project_name: "${PROJECT_NAME}",package_path: "${k}-${DEPLOY_TERMINAL}${PACKAGE_NAME_POST_FIX}",project_key: "${PROJECT_KEY}"
                    }
                  }
                }
              }
            }
          }
        }

        stage('prepare tools') {
          steps {
            sh """
              docker run \
                --rm \
                -v "${env.WORKSPACE}:/usr/src" \
                -v "/tmp/${PROJECT_NAME}:/root/.cache" \
                -w /usr/src \
                vipxf/node:14-buster \
                yarn install
            """
            sh """
              docker run \
                --rm \
                -v "${env.WORKSPACE}:/usr/src" \
                -v "/tmp/${PROJECT_NAME}:/root/.cache" \
                -w /usr/src \
                vipxf/node:14-buster \
                yarn build:components
            """
            sh """
              docker run \
                --rm \
                -v "${env.WORKSPACE}:/usr/src" \
                -v "/tmp/${PROJECT_NAME}:/root/.cache" \
                -w /usr/src \
                vipxf/node:14-buster \
                yarn bootstrap
            """
          }
        }

        stage('set env') {
          steps {
            script {
              GIT_VERSION = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
              PACKAGE_VERSION = sh(returnStdout: true, script: "docker run --rm -v ${env.WORKSPACE}:/usr/src -w /usr/src vipxf/node:14-buster node -p 'require(\"./package.json\").version'").trim()
              RELEASE_VERSION = PACKAGE_VERSION + '-' + BUILD_NUMBER + '+' + GIT_VERSION
              echo "RELEASE_VERSION: ${RELEASE_VERSION}"
            }
          }
        }
      }
    }

    stage('lint') {
      when {
        not {
          anyOf {
            expression { params.ACTION == "deploy" }
            expression { params.ACTION == "restart" }
          }
        }
      }
      steps {
        sh """
          docker run \
            --rm \
            -v "${env.WORKSPACE}:/usr/src" \
            -v "/tmp/${PROJECT_NAME}:/root/.cache" \
            -w /usr/src \
            vipxf/node:14-buster \
            yarn lint
        """
      }
    }

    stage('unit test') {
      when {
        not {
          anyOf {
            expression { params.ACTION == "deploy" }
            expression { params.ACTION == "restart" }
          }
        }
      }
      steps {
        script {
          echo "unit test"
          sh """
            docker run \
              --rm \
              -v "${env.WORKSPACE}:/usr/src" \
              -v "/tmp/${PROJECT_NAME}:/root/.cache" \
              -w /usr/src \
              vipxf/node:14-buster \
              yarn test
          """
        }
      }
    }

    stage('e2e test') {
      when {
        not {
          anyOf {
            expression { params.ACTION == "deploy" }
            expression { params.ACTION == "restart" }
          }
        }
      }
      stages {
        // stage('e2e - start frontend service') {
        //   steps {
        //     script {
        //       echo "e2e start micro services"
        //       sh """
        //         docker run \
        //           --rm \
        //           -d \
        //           -v "${env.WORKSPACE}:/usr/src" \
        //           -v "/tmp/${PROJECT_NAME}:/root/.cache" \
        //           -w /usr/src \
        //           -p 3000:3000 \
        //           -p 3001:3001 \
        //           -p 3002:2525 \
        //           -p 10000:10000 \
        //           vipxf/node:14-buster \
        //           yarn serve:mock
        //       """
        //     }
        //   }
        // }
        stage('e2e - start cases') {
          steps {
            script {
              echo "e2e run cases"
              // sh """
              //   docker run \
              //     --rm \
              //     --ipc=host \
              //     --init \
              //     -v "${env.WORKSPACE}:/usr/src" \
              //     -v "/tmp/${PROJECT_NAME}:/root/.cache" \
              //     -w /usr/src \
              //     -e NODE_ENV=ci \
              //     -e DEBUG=pw:api \
              //     playwright:v1.21.1-focal \
              //     yarn test:e2e
              // """
            }
          }
        }
      }

    }

    stage('build') {
      steps {
        script {
          parallel buildStages
        }
      }
    }

    stage('sonar branch analysis') {
      when {
        not { changeRequest() }
        not {
          anyOf {
            expression { params.ACTION == "deploy" }
            expression { params.ACTION == "restart" }
          }
        }
      }

      steps {
        script {
          echo "==================== 开始sonar扫描 ==================== "
          sh """
            docker run \
              --rm \
              -e SONAR_HOST_URL="http://${env.SONAR_HOST_URL}" \
              -e SONAR_LOGIN="${env.SONAR_LOGIN}" \
              -v "${env.WORKSPACE}:/usr/src" \
              sonarsource/sonar-scanner-cli -Dsonar.branch.name=${BRANCH_NAME}
          """
        }
      }
    }

    stage('sonar pull request analysis') {
      when {
        changeRequest()
        not {
          anyOf {
            expression { params.ACTION == "deploy" }
            expression { params.ACTION == "restart" }
          }
        }
      }

      steps {
        script {
          echo "==================== 开始sonar扫描 ==================== "
          sh """
            docker run \
              --rm \
              -e SONAR_HOST_URL="http://${env.SONAR_HOST_URL}" \
              -e SONAR_LOGIN="${env.SONAR_LOGIN}" \
              -v "${env.WORKSPACE}:/usr/src" \
              sonarsource/sonar-scanner-cli -Dsonar.branch.name=${BRANCH_NAME}
          """
        }
      }
    }

    stage('package') {
      when {
        anyOf {
          expression { params.ACTION == "deploy" }
          expression { params.ACTION == "restart" }
          expression { params.ACTION == "release" }
        }
      }

      steps {
        script {
          parallel packageStages
        }
      }
    }

    stage('deploy') {
      when {
        anyOf {
          expression { params.ACTION == "deploy" }
          expression { params.ACTION == "restart" }
        }
      }
      steps {
        script {
          parallel deployStages
        }
      }
    }

    stage('发布版本包') {
      when {
        expression { params.ACTION == 'release' }
      }
      options {
        timeout(5)
      }
      stages {
        stage('Release Modules') {
          steps {
            script {
              parallel releaseStages
            }
          }
        }
        // stage('Release Archive') {
        //   steps {
        //     script {
        //       archiveArtifacts(artifacts: "${k}${PACKAGE_NAME_POST_FIX}", onlyIfSuccessful: true, fingerprint: true)
        //       publish project_type: 'vfcf',project_name: "${PROJECT_NAME}",package_path: "${k}${PACKAGE_NAME_POST_FIX}",project_key: "${PROJECT_KEY}"
        //     }
        //   }
        // }
      }
    }

  }
  post {
    success {
      setBuildStatus("${GITLAB_PROJECT_ID}", "${GITLAB_COMMIT_ID}", "success", "${GITLAB_TOKEN}")
    }
    unstable {
      setBuildStatus("${GITLAB_PROJECT_ID}", "${GITLAB_COMMIT_ID}", "failed", "${GITLAB_TOKEN}")
    }
    failure {
      setBuildStatus("${GITLAB_PROJECT_ID}", "${GITLAB_COMMIT_ID}", "failed", "${GITLAB_TOKEN}")
    }
  }
}
