const ControllerBase = require('./controllerBase');

class CountriesController extends ControllerBase {
    async getCountries() {
        try {
            const countries = [{ _id: 0 }, { _id: 1 }, { _id: 2 }];
            const resources = await Promise.all(countries.map(async (country) =>   {
                const model = new CountriesModel(country);
                const resource = await model.getResource(this.uriGenerator);
                return resource;
            }));

            this.success(resources);
        } catch (err) {
            this.error(err);
        }
    }

    async getContry() {
        const { id } = this.params;

        try {
            const countryModel = new CountriesModel({ _id: id });
            const resource = await countryModel.getResource(this.uriGenerator);
            this.success(resource);
        } catch (err) {
            this.error(err);
        }
    }

    async removeCountry() {
        try {
            this.nocontent();
        } catch (err) {
            this.error(err);
        }
    }
}

module.exports = CountriesController;