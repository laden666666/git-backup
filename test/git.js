import backupGitService from '../src/service/backupGitService'
import chai from 'chai';
var assert = chai.assert;

describe('git相关函数测试', function() {
    it('url有效性测试', function() {
        var result = backupGitService.checkGitURL('https://github.com/laden666666/git-backup.git')
        assert.equal(result, true);
        var result = backupGitService.checkGitURL('https://laden666666:xxxxxx@github.com/laden666666/git-backup.git')
        assert.equal(result, true);
        result = backupGitService.checkGitURL('git@github.com:laden666666/git-backup.git')
        assert.equal(result, true);
        result = backupGitService.checkGitURL('https://gitee.com/dong_shang/sd-test.git')
        assert.equal(result, true);
        result = backupGitService.checkGitURL('xxxxxx')
        assert.equal(result, false);
        result = backupGitService.checkGitURL('https://xxxxxx')
        assert.equal(result, false);
    });

    it('获得仓库名称', function() {
        var reopName = backupGitService.getReopName('https://github.com/laden666666/git-backup.git')
        assert.equal(reopName, 'git-backup');
    });

    it('判断远程仓库是否有效', async function() {
        var result = await backupGitService.checkURLIsRepo('https://github.com/laden666666/git-backup.git')
        assert.equal(result, true);
        result = await backupGitService.checkURLIsRepo('https://www.baidu.com/laden666666/git-backup.git')
        assert.equal(result, false);
    });
});