import {TeamMember} from "./TeamMember";

export class Step {
    finished_at = "";
    status = "";
    step = "";
    team: TeamMember[] = []

    constructor(obj?: Partial<Step>) {
        if (obj) {
            Object.assign(this, obj)
        }
    }
}