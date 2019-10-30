import { ppAPI, APIMethod } from './ppAPI';



class ProjectAPI {

    constructor() {
        
    }

    public async getProjects() {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`projects`, APIMethod.GET));
        return ret
    }

    public async getProject(productId: string) {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`projects/${productId}`, APIMethod.GET));
        return ret
    }

    public async getProjectsByTags(tags:string[]) {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`projects?tags=${tags.join(',')}`, APIMethod.GET));
        return ret
    }

    public async getProjectsByTagsByTypes(tags:string[], types:string[]) {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`projects?tags=${tags.join(',')}&types=${types.join(',')}`, APIMethod.GET));
        return ret
    }
};

export { ProjectAPI };