import config from '../../config'
import gitP from 'simple-git/promise';
import path from 'path'
import fs from 'fs-extra'

const extractZip  = require('extract-zip');
const filesTree = require('files-tree');
const zip = require("node-native-zip");


function initialiseRepo (git, origin) {
    return git.init()
    .then(() => git.addRemote('origin', origin))
}

function paramToArray(param) {
    if (Array.isArray(param)) {
        return param
    } else if (typeof param === 'string') {
        return [param]
    } else {
        return [];
    }
}

export default {
    initGitReop(origin){
        const git = gitP();
        
        var dir = path.join(__dirname, '../../work', this.getReopName(origin))

        return fs.ensureDir(dir)
        .then(() => {
            git.cwd(dir)

            return git.checkIsRepo()
            .then(isRepo => !isRepo && initialiseRepo(git, origin))
            .then(() => git.fetch())
            .then(() => git.checkout('master'));
        })
        .then(()=>dir)


    },
    getReopName(origin){
        var names = /\/([a-zA-Z0-9\\-]*).git$/g.exec(origin)
        if(!names){
            throw new Error('未能获取正确的资源名称')
        } else {
            return names[1]
        }
    },
    /**
     * 压缩指定路径下的所有文件及文件夹
     * @param paths string or array 指定的压缩路径，可以是多个
     * @param name 压缩后的文件名及文件路径
     */
    zipFolder(paths, name) {
        var dir = path.dirname(name)
    
        return fs.ensureDir(dir).then(()=>{
            return new Promise((resolve, reject)=> {
                paths = paramToArray(paths);
                name = name || Date.now() + '.zip';
                var list = [], files = [], archive = new zip();
                paths.forEach(function (i) {
                    list = filesTree.allFile(i);
                    list.forEach(function (item) {
                        item.file && files.push({path: item.path, name: path.posix.join('', path.posix.relative(i, item.path))})
                    });
                });
    
    
                archive.addFiles(files, function (err) {
                    if (err) {
                        reject(err)
                    } else {
                        var buff = archive.toBuffer();
                        fs.outputFile(name, buff).then(resolve, reject);
                    }
                });
            })
        })
    },
    async zipGitReop(origin) {
        
        var from = path.join(__dirname, '../../work', this.getReopName(origin))
        var to = path.join(config.backupDir, this.getReopName(origin) + '.zip')
        if(fs.existsSync(to)){
            await fs.remove(to)
        }
        await this.zipFolder(from, to)
    }
}