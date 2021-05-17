'use strict';
const axios = require("axios");
const fs = require('fs');
const comunasURL = "http://www.servelelecciones.cl/data/elecciones_constitucion/filters/comunas/all.json";
const circPorComunaURL = "http://www.servelelecciones.cl/data/elecciones_constitucion/filters/circ_electoral/bycomuna/";
const circElecURL = "http://www.servelelecciones.cl/data/elecciones_constitucion/filters/circ_electoral/allchile.json";
const localesURL = "http://www.servelelecciones.cl/data/elecciones_constitucion/filters/locales/bycirc_electoral/";
const mesasLocalesURL = "http://www.servelelecciones.cl/data/elecciones_constitucion/filters/mesas/bylocales/";
const computoPorMesaURL = "http://www.servelelecciones.cl/data/elecciones_constitucion/computomesas/";
const computoConvPorMesaURL = "http://www.servelelecciones.cl/data/elecciones_convencion/computomesas/";

var salida=[];

const getData = async url => {
  try {
      const response = await axios.get(url);
      const data = response.data;
      return data;
      //console.log(data);
  } catch (error) {
      //console.log(error);
      return null;
  }
};


async function GetComputos(mesa,local,circ,comuna){
    try{
	const computos = await getData(computoConvPorMesaURL+mesa.c+".json");
	if(computos!=null){
	    //var result = {'Comuna':comuna.d,'Circ_Elec':circ.d,'Local':local.d,'Mesa':mesa.d,'Apruebo':computos.data[0].c,'Rechazo':computos.data[1].c,'Nulos':computos.resumen[1].c,'Blancos':computos.resumen[2].c,'Total':computos.resumen[3].c,'p':computos.resumen[3].d,'md':mesa.md};
	    var result = {'Comuna':comuna.d,'Circ_Elec':circ.d,'Local':local.d,'Mesa':mesa.d,'Mixta':computos.data[0].c,'CC':computos.data[1].c,'Nulos':computos.resumen[1].c,'Blancos':computos.resumen[2].c,'Total':computos.resumen[3].c,'p':computos.resumen[3].d,'md':mesa.md};
	    console.log(JSON.stringify(result));
	    salida.push(result);
	    if(salida.length%100==0){
		fs.writeFileSync('salida_convencion.json', JSON.stringify(salida));
	    }
	}
    }catch(error){
	console.log(error);
    }
}

async function GetMesas(local,circ,comuna){
    try{
	const mesas = await getData(mesasLocalesURL+local.c+".json");
	if(mesas!=null){
	    for(var i=0;i<mesas.length;++i)
		await GetComputos(mesas[i],local,circ,comuna);
	}
    }catch(error){
	console.log(error);
    }
}

async function GetLocales(circ,comuna){
    try{
	const locales = await getData(localesURL+circ.c+".json");
	if(locales!=null){
	    for(var i=0;i<locales.length;++i)
		await GetMesas(locales[i],circ,comuna);
	}
    }catch(error){
	console.log(error);
    }
}

async function GetCircs(comuna){
    try{
	const circs = await getData(circPorComunaURL+comuna.c+".json");
	if(circs!=null){
	    for(var i=0;i<circs.length;++i)
		await GetLocales(circs[i],comuna);
	}
    }catch(error){
	console.log(error);
    }
}

async function GetComuna() {
    try{
	const comunas = await getData(comunasURL);
	if(comunas!=null){
	    for(var i=0;i<comunas.length;++i)
		await GetCircs(comunas[i]);
	}
    }catch(error){
	console.log(error);
    }
    fs.writeFileSync('salida_convencion.json', JSON.stringify(salida));
}

GetComuna();

