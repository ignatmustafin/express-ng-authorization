import User from "../models/user.model"



export default class authController {
    async userRegistration(req: any, res: any) {
        try {
            const {name, email, password} = req.body
            const user: any = await User.create({ name, email, password})
    
            res.status(201).json({success: true, data: `user with id ${user.dataValues.id} created successfully`})
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    }
}