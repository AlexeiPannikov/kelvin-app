export class MemberOfTheTeam {
    id: number = null
    name = ""

    constructor(obj?: Partial<MemberOfTheTeam>) {
        if (obj) Object.assign(this, obj)
    }
}