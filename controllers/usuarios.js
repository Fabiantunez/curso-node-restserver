const { response } = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { emailExiste } = require('../helpers/db-validators');



const usuariosGet = async(req = request, res = response) => {

    //const { q, nombre = 'No name', apikey, page = 1 , limit } = req.query;
    const{ limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    /*const usuarios = await Usuario.find( query )
    .skip( Number(desde))
    .limit(Number(limite)) //asi casteamos el limite que pase de ser un string a un numero si es que lo cambiamos en el get

    const total = await Usuario.countDocuments( query );*/

    const [ total, usuarios ] = await Promise.all([  //para que ejecute ambas promesas simultaneas
    Usuario.countDocuments( query ),
      Usuario.find( query )
    .skip( Number(desde))
    .limit(Number(limite)) 
    ])


    res.json({
      total,
      usuarios
    })
  }

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body

    //TODO validar contra BD
    if (password) {
      //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto)

    res.json( usuario )
  }  

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario( { nombre, correo, password, rol } )

    //Verificar si el correo existe
   

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt )

    //Guardar en BD
    await usuario.save();
    

    res.json({
        usuario,
    })
  }  

const usuariosDelete = async(req, res = response) => {

  const { id } = req.params;

  // Borrar fisicamente
  //const usuario = await Usuario.findByIdAndDelete( id )

  const usuario = await Usuario.findByIdAndUpdate( id, { estado: false })

    res.json( usuario )
  }  

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
  }  




  module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
  }