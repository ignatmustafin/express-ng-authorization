import Activations from "../../models/activation.model";

class ActivationUtils {

    async clearActivationLink(userId: number, transaction: any) {
        return await Activations.update({activationLink: ""}, {where: {user_id: userId}, transaction});
    }
}


export default new ActivationUtils()