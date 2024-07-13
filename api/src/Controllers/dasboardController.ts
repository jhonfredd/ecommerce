import { NextFunction, Request, Response } from "express";
import dasboardSchema from "../Schemas/dasboardSchema";


const getDasboard = async (req: Request, res: Response, next:NextFunction ) =>{
    const getDasboard = await dasboardSchema.find();
    try {
        
        if(getDasboard){
            return res.status(200).json({
                status: true,
                message: "",
                data: getDasboard,
            })
        }else{
            return res.status(200).json({
                status: true,
                message: "",
                data:[],
            })
        }
    } catch (error) {
        return res.status(500).json({error: "Algo salió mal"})
    }
}

const registerDasboards = async (req: Request, res: Response, next:NextFunction ) =>{
    const {title, sub_title, description,price ,status} = req.body;

    if(!title ||  !sub_title || !description || !price || !status){
        return res.status(404).json({error: "Todos los campos son obligatorios"});
    }

    const dasboardProducts = await dasboardSchema.findOne({title});
    if(dasboardProducts){
        return res.status(404).json({error: "El nombre ya existe."})
    }

    try {
        const dasboardProduct = await dasboardSchema.create({
            title,
            sub_title,
            description,
            price,
            status,
        })

        res.status(200).json({
            status: true,
            message: "Prodcutos creado",
            data: {_id: dasboardProduct._id, title: dasboardProduct.title, sub_title: dasboardProduct.sub_title, description : dasboardProduct.description, price: dasboardProduct.price}
        });
    } catch (error) {
        return res.status(500).json({error: 'Algo salió mal'});
    }
}


const updateDasboard = async (req: Request, res: Response, next: NextFunction) => {
    const { _id, title, sub_title, description, price } = req.body; 

    if(!title || !sub_title || !description || !price){
        return res.status(404).json({ error: 'Error todos los campos son obligatorios'});
    }

    const marca_exits = await dasboardSchema.findOne({ title: title, sub_title: sub_title, description: description, price:price, _id: { $ne: _id } });
    if (marca_exits) {
        return res.status(404).json({ error: 'La marca ya existe.' }); 
    }

    try{
        const updateDasboard = await dasboardSchema.findByIdAndUpdate(
            _id,
            { title, sub_title , description, price }, 
            { new: true } 
        );

        return res.status(200).json({
            status: true,
            message: 'La marca se ha actualizado.',
            updateMarca: updateDasboard,
        });

    }catch(error) {
        return res.status(500).json({ error: 'Ocurrio un error, intenta mas tarde.' });
    }
}



const cambioEstadoDasboard = async (req: Request, res: Response, next: NextFunction) => {
    const { id, status } = req.body; 

    const _id = id;
    try{
        const updateDasboard = await dasboardSchema.findByIdAndUpdate(
            _id,
            { status }, 
            { new: true } 
        );

        return res.status(200).json({
            status: true,
            message: 'El Dasboard se ha actualizado.',
            updatedModelos: updateDasboard,
        });

    }catch(error) {
        return res.status(500).json({ error: 'Ocurrio un error, intenta mas tarde.' });
    }
}


export { registerDasboards, getDasboard, updateDasboard,cambioEstadoDasboard} //retorn las rutas creadas