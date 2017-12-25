// import config from '../config'
// import path from 'path'
// import backuoGitService from './service/backuoGitService'
// import ora from 'ora'

// (async ()=>{
//     var length = config.gitList.length
//     for(let i = 0; i < length; i++){
//         var origin = config.gitList[i]
//         const spinner = ora(`开始备份${backuoGitService.getReopName(origin)}（${i}/${length}）`)
//         spinner.start()
//         await backuoGitService.initGitReop(origin)
//         await backuoGitService.zipGitReop(origin)
//         spinner.stop()
//     }
    
// })()
import app from './pages/'