export const GitRepertoryFactory = {
    create(id=Date.now(), name='', repertoryURL='', labels=[]){
        var object = {}
        object.id = id;
        object.name = name;
        object.repertoryURL = repertoryURL
        object.labels = [...labels]
        return object
    },
}