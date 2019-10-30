import { ppAPI, APIMethod } from './ppAPI';



class AssessmentAPI {

    constructor() {
        
    }

    public async getAssessments() {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`assessments`, APIMethod.GET));
        return ret
    }

    public async getAssessment(assessmentId: string) {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`assessments/${assessmentId}`, APIMethod.GET));
        return ret
    }

    public async getAssessmentsByTags(tags:string[]) {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`assessments?tags=${tags.join(',')}`, APIMethod.GET));
        return ret
    }

    public async getAssessmentsByTagsByTypes(tags:string[], types:string[]) {
        var ret:any;
        ret = JSON.parse(await ppAPI.requestToBack(`assessments?tags=${tags.join(',')}&types=${types.join(',')}`, APIMethod.GET));
        return ret
    }
};

export { AssessmentAPI };