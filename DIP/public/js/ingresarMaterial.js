function formatoC(id1, id2) {
  $(id1).html("");
  $(id2).html(
    `<img src="/assets/img/satisfactorio.png" width= "20" height= "20">`
  );
}
function formatoI(id1, id2) {
  $(id1).html(`<p>Debe ser formato pdf</p>`);
  $(id2).html(
    `<img src="/assets/icons/notificacion-error.ico" width= "20" height= "20">`
  );
}

function mostrarCampo(check) {
  if (check.checked) {
    $("tr#tr-pdf-1").hide();
    $("tr#tr2-pdf-1").hide();
  } else {
    $("tr#tr-pdf-1").show();
    $("tr#tr2-pdf-1").show();

  }
}
function comprobarF(archivo) {
  var i = $(archivo).attr("id").split("-").pop();
  var ext = $(archivo).val().split(".").pop().toLowerCase();

  var id1 = "p#formato-pdf-" + i;
  var id2 = "td#img-pdf-" + i;
  if ($(archivo).val() != "") {
    if (ext === "pdf") {
      formatoC(id1, id2);
    } else {
      formatoI(id1, id2);
    }
  }
}

function tipoTrabajo(trabajo) {
  if ($(trabajo).val().toLowerCase() === "trabajo de grado") {
    $("div#tutor").append(`
           <input id="tutor" name="tutor" type="text" class="tooltips-general material-control" placeholder="Escribe aquí el tutor del libro" required="" pattern="[Áa-z- -ñ]{1,}" maxlength="70" data-toggle="tooltip" data-placement="top" title="Escribe el nombre del tutor del libro">
                       <span class="highlight"></span>
                       <span class="bar"></span>
                       <label>Autor</label>`);
  } else {
    $("div#tutor").html("");
  }
}

function añadirC(campo, divImg) {
  $("div#pdfs").append(campo);
  $("div#pdfs").append(`<div class="col-md-2" id="imgs-pdfs"></div>`);
  $("td#imgs-pdfs").append(divImg);
}

function removerC(id, id1) {
  $(id).remove();
  $(id1).remove();
}
function añadirArchivo(input) {
  var i = $(input).attr("id").split("-").pop();
  var idd = "td#td-pdf-" + i;
  var id2 = "div#img-pdf-" + i;

  if (input.checked) {
    var cambio = `
               <div class="col-md-10" id="div-pdf-${i}">
               <input onchange="comprobarF(this)" id="pdf-${i}" type="file" name="pdf-${i}" class="tooltips-general material-control" data-toggle="tooltip" data-placement="top" title="Archivo PDF ${i}">
                      
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label>Archivo PDF ${i}</label>
                       <p class="text-center" id="formato-pdf-${i}"> </p>
               </div>`;
    var camp = `
               <div  id="img-pdf-${i}"></div>`;
    añadirC(cambio, camp);
  } else {
    removerC(idd, id2);
  }
}

function ejemplares() {
  let inputEjemplar = $("input#ejemplar");
  if (inputEjemplar.val() >= 1) {
    $("table#tb").html("");
    $("div#img-cota-1").html("");
    $("div#incluye-pdf").html("");
    $("div#no-incluye-pdf").html("");
    for (var i = 1; i <= inputEjemplar.val(); i++) {
      $("table#tb").append(`
                <tr>
                               <td style="width: 30px; overflow: hidden;">
                                <input  id="ejemplar${i}" name="ejemplar${i}" type="number" class="tooltips-general material-control" placeholder="Ej.${i}" required="" maxlength="4" data-toggle="tooltip" data-placement="top" title="Numero de ejemplar" value="${i}">
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label>ejemplar</label>
                              
                               </td>
                               <td style="width: 200px; overflow: hidden;">
                                <input  id="cota-${i}" onchange="añadirCampoPdf(this)"  name="cota_${i}" type="text" class="tooltips-general material-control" placeholder="Escribe aquí la cota del libro" required="" maxlength="25" data-toggle="tooltip" data-placement="top" title="La cota del libro">
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label>Cota</label>
                                
                               </td>
                               <td id="imgs-cota" style="width: 20px; overflow: hidden;">
                                <div id="img-cota-${i}"></div>
                               </td>
                            </tr>
                            <tr>
                            <td style="width: 30px; overflow: hidden;"></td>
                            <td id="mensaje-cota" style="width: 200px; overflow: hidden;"><div  id="cota-unica-${i}" ></div></td>
                            <td style="width: 20px; overflow: hidden;"></td>
                            </tr>
                            
                `);
      if (i < inputEjemplar.val()) {
        $("div#incluye-pdf").append(`
                      <br>
                       <input  onchange="añadirArchivo(this)"   id="incluye-pdf-${i}" type="checkbox" name="incluye-pdf-${i}" value="${i}" class="tooltips-general" title="Incluye PDF el Ej. ${i}" >PDF Ej.${i}
                     <br>
                       `);
      } else {
        $("div#incluye-pdf").append(`
                      <br>
                       <input class="tooltips-general"  onchange="añadirArchivo(this)"  title="Incluye PDF el Ej.${i}" id="incluye-pdf-${i}" type="checkbox" name="incluye-pdf-${i}" value="${i}" >PDF Ej.${i}
                       `);
      }
    }
  } else {
    $("table#tb").html("");
    $("div#img-cota-1").html("");
    $("div#incluye-pdf").html("");
    $("div#no-incluye-pdf").html("");
    $("table#tb").append(`
                <tr>
                               <td style="width: 30px; overflow: hidden;">
                                <input  id="ejemplar1" name="ejemplar1" type="number" class="tooltips-general material-control" placeholder="Ej.1" required="" maxlength="4" data-toggle="tooltip" data-placement="top" title="Numero de ejemplar" value="1">
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label>ejemplar</label>
                              
                               </td>
                               <td style="width: 200px; overflow: hidden;">
                                <input  id="cota-1" onchange="añadirCampoPdf(this)"  name="cota_1" type="text" class="tooltips-general material-control" placeholder="Escribe aquí la cota del libro" required="" maxlength="25" data-toggle="tooltip" data-placement="top" title="La cota del libro">
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label>Cota</label>
                                
                               </td>
                               <td id="imgs-cota" style="width: 20px; overflow: hidden;">
                                <div id="img-cota-1"></div>
                               </td>
                            </tr>
                            <tr>
                            <td style="width: 30px; overflow: hidden;"></td>
                            <td id="mensaje-cota" style="width: 200px; overflow: hidden;"><div  id="cota-unica-1" ></div></td>
                            <td style="width: 20px; overflow: hidden;"></td>
                            </tr>
                            
                `);
  }
};
function showModal() {
  document.getElementById('openModal').style.display = 'block';
};

function CloseModal() {
  document.getElementById('openModal').style.display = 'none';
};

function resetear () {
    
    $("td#mensaje-cota").html("");
    $("div#estatus").html("");
    $("td#img-pdf-1").html("");
    $("td#imgs-cota").html("");
    $("p#formato-pdf-1").html("");
    $("div#mensaje").html("");
    $("tr#tr2-pdf-1").html("");

    $("button#guardar").html(`<div id="estatus">
               <i class="zmdi zmdi-floppy"></i>
                  </div> <p id="boton">&nbsp;&nbsp; Guardar</p>`);
                

    $("table#tb").html("");
    $("table#tb").append(`
                  <tr>
                                 <td style="width: 30px; overflow: hidden;">
                                  <input  id="ejemplar1" name="ejemplar1" type="number" class="tooltips-general material-control" placeholder="Ej.1" required="" maxlength="4" data-toggle="tooltip" data-placement="top" title="Numero de ejemplar" value="1">
                                  <span class="highlight"></span>
                                  <span class="bar"></span>
                                  <label>ejemplar</label>
                                
                                 </td>
                                 <td style="width: 200px; overflow: hidden;">
                                  <input  id="cota-1" onchange="añadirCampoPdf(this)"  name="cota_1" type="text" class="tooltips-general material-control" placeholder="Escribe aquí la cota del libro" required="" maxlength="25" data-toggle="tooltip" data-placement="top" title="La cota del libro">
                                  <span class="highlight"></span>
                                  <span class="bar"></span>
                                  <label>Cota</label>
                                  
                                 </td>
                                 <td id="imgs-cota" style="width: 20px; overflow: hidden;">
                                  <div id="img-cota-1"></div>
                                 </td>
                              </tr>
                              <tr>
                              <td style="width: 30px; overflow: hidden;"></td>
                              <td id="mensaje-cota" style="width: 200px; overflow: hidden;"><div  id="cota-unica-1" ></div></td>
                              <td style="width: 20px; overflow: hidden;"></td>
                              </tr>
                              
                  `);     

                     
  document.getElementById("tipo_l").focus({preventScroll:true});
   document.getElementById("reset").click();
    document.getElementById("mostrar").click();
    document.getElementById("mostrar").click();
    $("p#mensaje-final").html('Su archivo se ha cargado con éxito');
    showModal();

  };
$(function (){
  let formato = $("form#formato");

  let inputEjemplar1 = $("input#ejemplar1");
  let divEjemplares = $("div#ejemplares");
  let divCotas = $("div#cotas");
  let divRow = $("div#row");
  let divImgs = $("div#imgs-cota");
formato.on("submit", function (e) {
    e.preventDefault();
    let data = new FormData(this);

    var isChecked = document.getElementById("mostrar").checked;
    if (isChecked) {
      data.delete("pdf");
    }

    $.ajax({
      beforeSend: function () {
        $("div#estatus").html(
          '<p class="text-center"><img src="/assets/gif/loading-22.gif"width= "20" height= "20"></p>'
        );
        $("p#boton").html("Guardando...");
      },
      url: "/bibliotecario/insert",
      type: "POST",
      data: data,
      processData: false,
      contentType: false,
    })
      .done(function (res) {
        $("div#estatus").html(
          `<img src="/assets/icons/correcto.ico"width= "20" height= "20">`
        );
        $("div#mensaje").html(`<p class="text-center">${res}</p>`);
        $("p#boton").html("Se ha guardado");
        setTimeout(resetear, 30);
      })
      .fail(function (error) {
        $("div#estatus").html(
          `<img src="/assets/icons/notificacion-error.ico"width= "20" height= "20">`
        );
        $("p#boton").html("¡Ha fallado!");
      });
  });

});

function mostrarCampo(check) {
  if (check.checked) {
    $("tr#tr-pdf-1").hide();
    $("tr#tr2-pdf-1").hide();
    $("input#pdf-1").removeAttr("required");
    
  } else {
    $("tr#tr-pdf-1").show();
    $("tr#tr2-pdf-1").show();
    $("input#pdf-1").prop("required", true);
  }
}

     function añadirCampoPdf(input){
    var bandera = 1;
    var cota1, cota2, cota, i, m;
   
    
     var elementos = document.getElementsByTagName('input');
     
       var tamaño = elementos.length;
       var elemento1;
       var matrizElementos = new Array();
       
       var matrizIndice = new Array();
       
   for(var j=0; j<tamaño; j++){
       
       cota1 = elementos[j].value;
       cota2 = $(input).val();
       elemento1 = elementos[j].getAttribute('id').charAt(0);
       
       if (elemento1 === "c"){
          
           matrizIndice.push(elementos[j].getAttribute('id').split('-').pop());
           matrizElementos.push(elementos[j].value);
           
       
        if(cota1 === cota2 ){
            
           i = elementos[j].getAttribute('id').split('-').pop();
            
             cota = cota2;
           
          }
       }
   }
   
   var tamañoM = matrizElementos.length;
   for (var f=0; f<=tamañoM; f++){
       if(cota === matrizElementos[f] && i !== matrizIndice[f]){
           bandera = 0;
           
           $(`div#img-cota-${i}`).html(`<br>
           <img src="/assets/icons/notificacion-error.ico" width= "20" height= "20">
           <br>
           <br>`);
           $(`div#cota-unica-${i}`).html(`<br>Cota repetida con el ejemplar ${matrizIndice[f]}`);
       }  
       }

   if (bandera === 1){
       
       $.ajax({
       
       url: '/bibliotecario/ec',
       type: 'POST',
       data:  {cota: cota}

      })
        .done(function(res){
       if (res === ''){
        $(`div#cota-unica-${i}`).html('');
        $(`div#img-cota-${i}`).html(`
        <img src="/assets/img/satisfactorio.png" width= "20" height= "20">
        `);  
       }else{
        $(`div#cota-unica-${i}`).html(`<p>${res}</p>`);
        $(`div#img-cota-${i}`).html(`
        <img src="/assets/icons/notificacion-error.ico" width= "20" height= "20">`);
     }

     })
      .fail(function(error){
       $(`div#cota-unica-${i}`).html(`<p>Ha ocurrido un error</p>`);
      });
   };
};

 
