class ModelBase {
    getResource() {
        let resource = {};
        for(let [key, value] of Object.entries(this)) {
            resource[ key ] = value;
        }
        return resource;
    }
}

module.exports = ModelBase;