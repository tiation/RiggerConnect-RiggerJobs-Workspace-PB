import Database from '../Database/DatabaseManager.js';

class RiggerService {
    static async registerRigger(riggerData) {
        const newRigger = await Database.Riggers.create(riggerData);
        return newRigger;
    }

    static async getRiggerProfile(riggerId) {
        const profile = await Database.Riggers.findById(riggerId);
        return profile;
    }
}

export default RiggerService;

