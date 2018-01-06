let baseID = Date.now()

export const GitRepertoryFactory = {
    create(id=baseID++, name='', repertoryURL='', labels=[]){
        var object = {}
        object.id = id;
        object.name = name;
        object.repertoryURL = repertoryURL
        object.labels = [...labels]
        return object
    },
}