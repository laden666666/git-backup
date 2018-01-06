import loki from 'lokijs'

var resolve, loadPromise = new Promise(r=>resolve = r)

var db = new loki('loki.json', {
    autoload: true,
    autoloadCallback : function databaseInitialize() {
        resolve()
    },
    autosave: true,
    autosaveInterval: 1000
})

export async function getGitRepertoryCollection() {
    await loadPromise
    var collection = db.getCollection('GitRepertory')
    if(!collection){
        collection = db.addCollection('GitRepertory', { indices: ['id'] })
    }
    return collection
}

export default db
