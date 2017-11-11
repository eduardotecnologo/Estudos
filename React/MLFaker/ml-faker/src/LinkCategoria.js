import React from 'react'

const LinkCategorias = ({categoria}) => {
    return (
        <a to={`/anuncios/categoria/`} className="btn btn-secondary h-100 m-2 col-sm">
            <i className={`fa fa-car fa-4x`} aria-hidden="true"></i><br />
            {categoria.categoria}
        </a>
    )
}
export default LinkCategorias