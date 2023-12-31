import { useForm } from 'react-hook-form'
import { addOrders } from '../../services/OrdenesService';
import { useState } from 'react';
import { getAfiliadoById, updateAfiliado } from '../../services/AfiliadoService';
import { useNavigate } from 'react-router-dom';
import { generarPDF } from './PdfOrden';
import { getComercioById } from '../../services/ComercioService'
import { mostrarAlerta } from '../../Utils/SweetAlert'
import './NuevaOrden.css'

export const NuevaOrden = () => {
  const [afilEncontrado, setAfilEncontrado] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [afiliado, setAfiliado] = useState({})
  const [comercio, setComercio] = useState({})
  const [data, setData] = useState({})
  const navigate = useNavigate();

  const porcentajeInteres = 0.05

  const onSubmit = (data) => {
    const { id_comercio, monto_credito, fecha_vencimiento, fecha_solicitud } = data
    if (!afilEncontrado) {
      getAfiliadoById(data.id_afiliado).then(
        data => {
          setAfiliado(data)
          setAfilEncontrado(true)
          setData(data)
        })

      return;
    }

    getComercioById(id_comercio)
      .then((dataComercio) => {
        if (dataComercio) {
          if (monto_credito <= afiliado.saldo) {
            const nuevoSaldo = afiliado.saldo - monto_credito;
            addOrders(
              afiliado.id_afiliado,
              id_comercio,
              monto_credito,
              fecha_vencimiento,
              fecha_solicitud,
              porcentajeInteres
            );

            const afiliadoActualizado = { ...afiliado, saldo: nuevoSaldo };
            updateAfiliado(afiliado.id_afiliado, afiliadoActualizado);

            setAfilEncontrado(false);
            setAfiliado({});
            reset();
            navigate('/ordenes');
            generarPDF(data, afiliado, dataComercio); 
          } else {
            mostrarAlerta('Saldo insuficiente', 'El afiliado no cuenta con suficiente saldo para esta operación');
            navigate('/ordenes');
          }
        } else {
          mostrarAlerta('Comercio no encontrado', 'El código de comercio proporcionado no existe');
          navigate('/ordenes');
        }
      })
      .catch((error) => {
        console.error('Error al buscar el comercio:', error);
        navigate('/ordenes');
      });

  }



  return (
    <>
      <div className="section-title">
        <h4 className="text-center">Generar nueva orden</h4>
      </div>
      <section className='section-container'>
        <div className='section-container-title'>
          <h4>Nueva Orden</h4>
        </div>
        <form className='form-order' onSubmit={handleSubmit(onSubmit)}>

          {
            !afilEncontrado ?
              <div className='form-input'>
                <label className='order-label'>Codigo de Afiliado</label>
                <input
                  type='number'
                  id='id_afiliado'
                  placeholder='Código de afiliado'
                  className='input-order'
                  {...register('id_afiliado', {
                    required: 'Debe ingresar un codigo de usuario válido.'
                  })}
                />
                <p>{errors.id_afiliado?.message}</p>
              </div>
              :
              <>
                <div className='form-input'>
                  <label className='order-label'>Codigo de Afiliado</label>
                  <input
                    type='number'
                    id='id_afiliado'
                    placeholder='Usuario'
                    className='input-order'
                    disabled

                    {...register('id_afiliado', {
                      required: 'Debe ingresar un codigo de usuario válido.'
                    })}
                  />
                  <p>{errors.id_afiliado?.message}</p>

                  <label className='order-label'>Codigo de comercio</label>
                  <input
                    type='number'
                    id='id_comercio'
                    placeholder='Comercio'
                    className='input-order'
                    {...register('id_comercio', {
                      required: '⚠ Debe ingresar un codigo de usuario válido'
                    })}
                  />
                  <p>{errors.id_comercio?.message}</p>

                  <label className='order-label'>Monto de crédito</label>
                  <input
                    type='number'
                    id='monto_credito'
                    placeholder='Monto'
                    className='input-order'
                    {...register('monto_credito', {
                      required: '⚠ Debe ingresar el monto de crédito.'
                    })}
                  />
                  <label className='order-label'>El porcentaje de interés de la cuota será {porcentajeInteres * 100}%</label>

                  <p>{errors.monto_credito?.message}</p>
                </div>



                <div className='form-input'>
                  <label className='order-label'>Fecha de emisión</label>
                  <input
                    type='date'
                    id='fecha_solicitud'
                    placeholder='Contraseña'
                    className='input-order'
                    {...register('fecha_solicitud', {
                      required: 'Debe ingresar una fecha de emisión válida.'
                    })}
                  />
                  <p>{errors.fecha_solicitud?.message}</p>
                  <label className='order-label'>Fecha de vencimiento</label>
                  <input
                    type='date'
                    id='fecha_vencimiento'
                    placeholder='Fecha'
                    className='input-order'
                    {...register('fecha_vencimiento', {
                      required: ' ⚠ Debe ingresar una fecha de vencimiento válida.'
                    })}
                  />
                  <p>{errors.fecha_vencimiento?.message}</p>
                </div>
              </>
          }


          <button className='btn-form-order' type='submit'>
            {!afilEncontrado ? "Buscar Afiliado" : "Generar Orden"}
          </button>
        </form>
      </section>

    </>
  )
}
