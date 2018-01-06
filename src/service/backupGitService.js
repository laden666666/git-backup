import config from '../../config'
import gitP from 'simple-git/promise';
import path from 'path'
import fs from 'fs-extra'
import { fail } from 'assert';

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
    },
    checkGitURL(url){

        var isPlainUrl = function(string) {
            var re = new RegExp('(?:https?\\:\\/\\/)[0-9a-zA-Z\.\-_]+\\/?$');
            return re.test(string);
        };
          
          // Switch to strict mode automatically if the following pattern matches passed
          // string
          var isStrictRequired = function(string) {
            return /git(@|:)|\.git(?:\/?|\\#[0-9a-zA-Z\.\-_]+)$/.test(string);
          };
          
          /**
           * isGithubUrl
           * Check if a passed string is a valid GitHub URL
           *
           * @name isGithubUrl
           * @function
           *
           * @param {String} url A string to be validated
           * @param {Object} options An object containing the following fields:
           *  - `strict` (Boolean): Match only URLs ending with .git
           *  - `repository` (Boolean): Match only valid GitHub repo URLs
           * @return {Boolean} Result of validation
           */
          function isGithubUrl(url, options) {
            options = options || {};
            var isStrict = options.strict || isStrictRequired(url);
            var repoRequired = options.repository || isStrict;
            var strictPattern = '\\/[\\w\\.-]+?\\.git(?:\\/?|\\#[\\w\\.\\-_]+)?$';
            var loosePattern = repoRequired
              ? '\\/[\\w\\.-]+\\/?(?!=.git)(?:\\.git(?:\\/?|\\#[\\w\\.\\-_]+)?)?$'
              : '(?:\\/[\\w\\.\\/-]+)?\\/?(?:#\\w+?|\\?.*)?$';
            var endOfPattern = isStrict ? strictPattern : loosePattern;
            var pattern = '(?:git|https?|git@)(?:\\:\\/\\/)?[0-9a-zA-Z\.\-_]+[/|:][A-Za-z0-9-_]+?' + endOfPattern;
          
            if (isPlainUrl(url) && !repoRequired) {
              return true;
            }
          
            var re = new RegExp(pattern);
            return re.test(url);
          };

        return isGithubUrl(url, {strict: true})
    },
    /**
     * 检查url是否是git资源。如果不是git资源返回false
     * @param {any} url 
     * @returns 
     */
    checkURLIsRepo(url){
        const git = gitP();
        
        var dir = path.join(__dirname, '../../temp/_checkURL')

        return fs.emptyDir(dir)
            .then(() => {
                git.cwd(dir)
                git.init()
            })
            .then(() => git.addRemote('remote', url))
            .then(() => git.raw(['remote', 'show', 'remote']))
            .then(function(){
                return true
            }, function(err){
                return false
            })
            .then(result => {
                return fs.remove(dir)
                    .then(()=>result)
            })
    }
}