import config from '../../config'
import gitP from 'simple-git/promise';
import path from 'path'
import fs from 'fs-extra'
import { backupTypes } from '../constants/ActionTypes'
import store from '../store'

//防止id冲突，所以采用时间戳生成初始id，然后自增生成后续id
let baseID = Date.now()

const extractZip  = require('extract-zip');
const filesTree = require('files-tree');
const zip = require("node-native-zip");

function initialiseRepo (git, origin) {
    return git.init()
    .then(() => git.addRemote('origin', origin))
}

function checkIsRepo (dir) {
    return fs.exists(path.join(dir, '.git'))
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

/**
 * 格式化日期字符串
 * @param date
 * @param fmt
 * @returns {*}
 */
function formatDate(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1,                 //月份
      "d+": date.getDate(),                    //日
      "h+": date.getHours(),                   //小时
      "m+": date.getMinutes(),                 //分
      "s+": date.getSeconds(),                 //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

export default {
    /**
     * 拉取git资源。如果已经初始化，会继承老资源拉取；否则会先初始化
     * @param {any} id 
     * @param {any} name 
     * @param {any} origin 
     * @returns 
     */
    fetchGitReop(id, name, origin){
        
        var dir = path.join(__dirname, '../../work', id + '', name)

        return fs.ensureDir(dir)
        .then(() => {
            var git = gitP(dir);
            return checkIsRepo(dir)
            .then(isRepo => {
                if(!isRepo){
                    return initialiseRepo(git, origin)
                }
            })
            .then(() => git.fetch())
        })
        .then(()=>path.join(__dirname, '../../work', id + ''))


    },
    /**
     * 根据url获取资源名称
     * @param {any} origin 
     * @returns 
     */
    getReopName(origin){
        var names = /\/([_a-zA-Z0-9\-]*).git$/g.exec(origin)
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
    //备份多个仓库
    async backupRepertoryList(repertoryList, decorator, {
        onStepFinish=()=>{},
        onStepFail=()=>{},
        onStep=()=>{},
        useZip=false, 
        hasTimeStamp=false
    }={}) {

        var cancel = false

        for(let i = 0 ; i < repertoryList.length; i++){
            if(cancel){
                break
            }

            var repertory = repertoryList[i]
            
            if(typeof onStep == 'function'){
                onStep(repertory)
            }
            try{
                //拉取资源
                var fromPath = await this.fetchGitReop(repertory.id, repertory.name,repertory.repertoryURL)
                //生成备份名
                var name = repertory.name + (hasTimeStamp ? formatDate(new Date(), 'yyyyMMddhhmm') : '')
                var toPath = path.join(decorator,name)

                //判断是否压缩
                if(useZip){
                    await this.zipFolder(fromPath, toPath + '.zip')
                } else {
                    if(fs.existsSync(toPath)){
                        await fs.remove(toPath)
                    }
                    await fs.copy(fromPath, toPath)
                }

                if(typeof onStepFinish == 'function'){
                    onStepFinish(repertory)
                }
            } catch (e){
                console.log(e)
                if(typeof onStepFail == 'function'){
                    onStepFail(repertory)
                    
                }
            }
        }
    },
    //压缩
    async zipGitReop(origin) {
        
        var from = path.join(__dirname, '../../work', this.getReopName(origin))
        var to = path.join(config.backupDir, this.getReopName(origin) + '.zip')
        if(fs.existsSync(to)){
            await fs.remove(to)
        }
        await this.zipFolder(from, to)
    },
    /**
     * 检验git仓库的url是否合法。该检验仅检验url字符串，不验证真正的url是否是git仓库
     * @param {any} url 
     * @returns 
     */
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
        
        var dir = path.join(__dirname, '../../temp/_checkURL' + baseID++)

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
    },
    /**
     * 关闭备份对话框
     */
    closeBackup(){
        store.dispatch({
            type: backupTypes.HIDE_BACKUP,
        })
    },
    /**
     * 打开备份对话框
     * @param {any} list        要备份的记录列表
     */
    showBackUp(list){
        store.dispatch({
            type: backupTypes.SHOW_BACKUP,
            payload: list
        })
    },
}