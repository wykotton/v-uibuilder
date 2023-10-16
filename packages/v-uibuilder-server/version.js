const path = require('path');
const fs = require("fs");
const mode = process.argv[2];
const buildconfig = async function() {
    if (!mode) return
    await fs.readFile(path.resolve(__dirname, `./env-test/ui-config.json`), 'utf-8', async function(err, data) {
        if (err) {
            throw new Error('读取配置文件失败...');
        }
        let version = data.match(/"version": "(.*)",/)[1];
        version = version.substr(0, version.lastIndexOf('.')) + '.' + (Number(version.substr(version.lastIndexOf('.') + 1)) + 1)
        const testJson = data.replace(/\"version(.*?),/, `"version": "${version}",`)
        await fs.writeFileSync(path.resolve(__dirname, `./env-test/ui-config.json`), testJson, function (err) {
            if (err) {
                throw new Error('修改配置文件失败...');
            }
        });
        
        await fs.readFileSync(path.resolve(__dirname, `./env-prod/ui-config.json`), 'utf-8', async function(err, data) {
            if (err) {
                throw new Error('读取配置文件失败...');
            }
            const prodJson = data.replace(/\"version(.*?),/, `"version": "${version}",`)
            await fs.writeFileSync(path.resolve(__dirname, `./env-prod/ui-config.json`), prodJson, function (err) {
                if (err) {
                    throw new Error('修改配置文件失败...');
                }
            });
        });
    });
}
buildconfig()