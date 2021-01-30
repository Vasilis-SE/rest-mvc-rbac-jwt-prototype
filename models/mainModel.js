class mainModel {
    getResource() {
        let resource = {};
        for(let [key, value] of Object.entries(this)) 
            if(value) resource[ key ] = value;
        
        delete resource.password;
        return resource;
    }
}

module.exports = mainModel;