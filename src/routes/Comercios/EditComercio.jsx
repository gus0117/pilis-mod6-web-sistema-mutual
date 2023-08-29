import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom';
import './NuevoComercio.css';
import { editComercio, getComercioById } from '../../services/ComercioService';

const EditComercio = () => {
    //const [incorrectForm, setIncorrectForm] = useState(false);
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: async () => getComercioById(id)
    });
    const navigate = useNavigate();

    useEffect(() => {
        //getComercioById(id).then(data => )
    }, [])

    const onSubmit = (data) => {
        const { name, cuit, barrio, calle, numero, phone, localidad } = data
        editComercio(id, name, cuit, barrio, calle, numero, phone, localidad).then(
            navigate('/comercios')
        );
    }
    return (
    <section className='container-nuevo-comercio'>
        <h1 className='letter'>Registrar Nuevo Comercio</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='form-nuevo-comercio'>
            <input type='text' className='input-comercio' placeholder='Nombre del comercio'
            {
                ...register('name', {
                    required: 'Debe ingresar un nombre de comercio válido.'
                })
            }/>
            <p>{errors.name?.message}</p>
            <input type='number' placeholder='N° de CUIT' className='input-comercio'
            {
                ...register('cuit', {
                    required: 'Debe ingresar el N° de CUIT del comercio'
                })
            } />
            <p>{errors.cuit?.message}</p>
            <input type='number' placeholder='Número de teléfono' className='input-comercio'
            {
                ...register('phone', {
                    required: 'Debe ingresar el N° de CUIT del comercio'
                })
            } />
            <p>{errors.phone?.message}</p>
            <input type='text' placeholder='Barrio' className='input-comercio'
            {
                ...register('barrio', {
                    required: 'Debe ingresar el nombre del barrio.'
                })
            } />
            <p>{errors.cuit?.message}</p>
            <input type='text' placeholder='Calle' className='input-comercio'
            {
                ...register('calle', {
                    required: 'Debe ingresar un nombre de la calle.'
                })
            }/>
            <p>{errors.name?.message}</p>
            <input type='number' placeholder='Número' className='input-comercio'
            {
                ...register('numero', {
                    required: 'Debe ingresar el número del domicilio.'
                })
            }/>
            <p>{errors.name?.message}</p>
            <input type='text' placeholder='Localidad' className='input-comercio'
            {
                ...register('localidad', {
                    required: 'Debe ingresar el nombre de la localidad.'
                })
            }/>
            <p>{errors.name?.message}</p>
            <div className="btn-comercio-container">
                <button className='btn-nuevo-comercio btn-guardar-comercio' type='submit'>Editar</button>
                <button className='btn-nuevo-comercio btn-reset-comercio' type='reset'>Borrar</button>
            </div>
        </form>
    </section>
    )
}

export default EditComercio