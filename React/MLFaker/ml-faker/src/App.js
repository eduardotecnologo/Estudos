import React, { Component } from 'react'
import logo from './logo.svg'
import HeaderHome from './HeaderHome'
import AnuncioHome from './AnuncioHome'
import FooterHome from './FooterHome'
import LinkCategoria from './LinkCategoria'
import base from './base'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      categorias:[],
      anuncios:[]
    }
    base.bindToState('categorias',{
      context: this,
      state: 'categorias'
    })
    base.bindToState('anuncios', {
      context: this,
      state: 'anuncios',
      queries:{
        limitToLast: 3
      }
    })
  }
  render() {
    let index = 0
    return (
      <div className="App">
        <HeaderHome />
        <div className="App">
          <div className="container">
          <h3>Últimos Anúncios</h3>
            <div class="row">
              {this.state.anuncios.map((anuncio, indice) => {
                return <AnuncioHome key={indice} anuncio={anuncio} />
                
              })}
            </div>
          <h3>Categorias</h3>
          {/* Testando
          {JSON.stringify(this.state.categorias)} */}
          <div className="row">
              { this.state.categorias.map((cat, indice) => {
                return [
                  <LinkCategoria categoria={cat} key={indice}/>,
                  ++index%4 === 0 && <div key={'c'+indice} className="w-100"></div>
                  ]
              })}
          </div>
        </div>
        <FooterHome />
        </div>
      </div>
    )
  }
}

export default App;
