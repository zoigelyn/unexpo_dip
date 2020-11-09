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
function mostrarCampo(check) {
  if (check.checked) {
    $("table#table-pdf").html('');
  } else {
   
    $("table#table-pdf").html(`<tr id="tr-pdf-1" style="border: none;">
                    <td  style="width: 200px;  border: none;" >
                        <input onchange="comprobarF(this)" id="pdf-1" name="pdf" type="file" required="" class="material-control tooltips-general" data-toggle="tooltip" data-placement="top" title="Archivo PDF">
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label >Archivo PDF</label>

                    </td>
                    <td  style="width: 30px;  border: none;" id="img-pdf-1">

                    </td>
                </tr>
                <tr id="tr2-pdf-1">
                    <td style="width: 200px; border: none;"><p class="text-center" id="formato-pdf-1"></p></td>
                    <td style="width: 30px;  border: none;">
                    </td>
                </tr>`);

  }
}
function tipoTrabajo(trabajo) {
  if ($(trabajo).val().toLowerCase() === "trabajo de grado") {
    $("div#tutor").html(`
           <input id="tutor" name="tutor" type="text" class="tooltips-general material-control" placeholder="Escribe aquí el tutor del libro" required="" pattern="[Áa-z- -ñ]{1,}" maxlength="70" data-toggle="tooltip" data-placement="top" title="Escribe el nombre del tutor del libro">
                       <span class="highlight"></span>
                       <span class="bar"></span>
                       <label>Autor</label>`);
  } else {
    $("div#tutor").html("");
  }
}
function añadirAtt(query){
  $(query).attr("disabled", true);
 };

   
function ver(input){
    
let cota = $(input).attr("id").split('-').pop();
        $.ajax({
      beforeSend: function () {
        $("div#cargando").html(
          '<p class="text-center"><img src="/assets/gif/loading-22.gif"width= "20" height= "20"></p>'
        );
        
      },
      url: `/bibliotecario/ver?cota=${cota}`,
      timeout: 3000,
      type: 'POST'
      
    })
      .done(function (libro, url) {
          
        $("div#cargando").html('');
        $("div#modal-body").html('');
        $("div#tutor").html('');
        $("div#modal-body").append(`
        <form  autocomplete="off" enctype="multipart/form-data" id="actualizar" onsubmit="actualizarLibro(this)">
                          
                          <div class="container-flat-form">
                             
                              <div class="title-flat-form title-flat-blue">Ver/Editar</div>
                              <div class="row">
                                 
                                  <div class="col-xs-12 col-sm-8 col-sm-offset-2">
                                      <legend><strong>Información básica</strong></legend><br>
              
                                      <div  class="group-material" >
                                          <span>Categoría</span>
                                          <select  onchange="tipoTrabajo(this)" id="tipo_l" name="tipo_l"  required="" class="tooltips-general material-control" data-toggle="tooltip" data-placement="top" title="Categoria del libro">
                                              <option selected="selected"  >${libro.libro[0].tipo_l}</option>
                                              <option>Libro</option>
                                              <option>Revista</option>
                                              <option>Trabajo de grado</option>
                          
                                          </select>
                                      </div>
                                     
                                      
                           <table class="table table-responsive " style="table-layout: fixed; border: none;" id="tb">
                            <tr>
                                     <td  style="width: 30%; overflow: hidden; border: none;">
                                      <input  id="ejemplar" name="ejemplar" type="number" class="tooltips-general material-control" placeholder="Ej.1" required="" maxlength="4" data-toggle="tooltip" data-placement="top" title="Numero de ejemplar" value="${libro.libro[0].ejemplar}">
                                      <span class="highlight"></span>
                                      <span class="bar"></span>
                                      <label>ejemplar</label>
                                    
                                     </td>
                                     <td style="width: 80%; overflow: hidden; border: none;">
                                        <input  id="cota"   name="cota" type="text" class="tooltips-general material-control" value="${libro.libro[0].cota}"placeholder="Escribe aquí la cota del libro" required="" maxlength="25" data-toggle="tooltip" data-placement="top" title="La cota no la puedes modificar" readonly>
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label>Cota</label>
                                     </td>
                                     
                                  </tr>
                                  
                              
                              </table>
                       
                                      <div  class="group-material">
                                          <input id="titulo" name="titulo" type="text" class="tooltips-general material-control" placeholder="Escribe aquí el título o nombre del libro" required="" pattern="[Aá-z- 1-9-ñ]{1,}" maxlength="70" data-toggle="tooltip" data-placement="top" value="${libro.libro[0].titulo}"title="Título del libro">
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label>Título</label>
                                      </div>
                                      <div  class="group-material">
                                          <input id="autor" name="autor" type="text" class="tooltips-general material-control" placeholder="Escribe aquí el autor del libro" required="" pattern="[Áa-z- -ñ]{1,}" maxlength="70" data-toggle="tooltip" data-placement="top" value="${libro.libro[0].autor}"title="Autor del libro">
                                          <span class="highlight"></span>
                                          <span class="bar"></span>
                                          <label>Autor</label>
                                      </div>
                                      <div class="group-material" id="tutor">
                                        
                                      </div>
                                      <div class="group-material">
                                          <input id="volumen" name="volumen" type="number" class="tooltips-general material-control" placeholder="Escribe aquí el volumen del libro" required="" maxlength="50" value="${libro.libro[0].volumen}" pattern="^[0-9]+" min="1"  data-toggle="tooltip" data-placement="top" title="Volumen del libro">
                                          <span class="highlight"></span>
                                          <span class="bar"></span>
                                          <label>Volumen</label>
                                      </div>
              
                                      <div  class="group-material">
                                          <input id="año" name="año" type="text" class="material-control tooltips-general" placeholder="Escribe aquí el año del libro" required="" pattern="[0-9]{1,4}" maxlength="4" data-toggle="tooltip" data-placement="top" value="${libro.libro[0].año}" title="Año del libro">
                                          <span class="highlight"></span>
                                          <span class="bar"></span>
                                          <label>Año</label>
                                      </div>
                                      <div  class="group-material">
                                          <input id="editorial" name="editorial" type="text" class="material-control tooltips-general" placeholder="Escribe aquí la editorial del libro" required="" pattern="[A-z- ]{1,}" maxlength="70" value="${libro.libro[0].editorial}" data-toggle="tooltip" data-placement="top" title="Editorial del libro">
                                          <span class="highlight"></span>
                                          <span class="bar"></span>
                                          <label>Editorial</label>
                                      </div>
                                      <div  class="group-material">
                                          <input name="estado_l" type="text" class="tooltips-general material-control" placeholder="Estado del libro" required="" pattern="[Aá-z- 1-9-ñ]{1,}" maxlength="70" data-toggle="tooltip" data-placement="top" value="${libro.libro[0].estado_l}"title="Estado del libro" disabled>
                            
                                      </div>
                                      
            <p class="text-center"> <a href="${libro.libro[0].destino}" target="_blak" role="button" class="btn btn-large btn-primary" id="${libro.libro[0].cota}">Ver Pdf de ${libro.libro[0].tipo_l} </a></p>
                           
                       <table class="table table-responsive " style="table-layout: fixed; border: none;" id="table-pdf" >      
                 <tr id="tr-pdf-1" style="border: none;">
                    <td  style="width: 80%;  border: none;" >
                        <input onchange="comprobarF(this)" id="pdf-1" name="pdf" type="file" required="" class="material-control tooltips-general" data-toggle="tooltip" data-placement="top" title="Archivo PDF">
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label >Archivo PDF</label>

                    </td>
                    <td  style="width: 30%;  border: none;" id="img-pdf-1">

                    </td>
                </tr>
                <tr id="tr2-pdf-1">
                    <td style="width: 80%; border: none;"><p class="text-center" id="formato-pdf-1"></p></td>
                    <td style="width: 30%;  border: none;">
                    </td>
                </tr>
                      </table>
                   
                                  <div  class="group-material" >
                                     <p class="text-center"> <input onchange="mostrarCampo(this)" id="mostrar" name="mostrar" type="checkbox"  value="1" class="tooltips-general" title="Incluye PDF">Mantener archivo PDF</p>
                                  </div>
                                      
                                      <p class="text-center">
                                          <button onclick="resetear()" id="reset" type="reset" class="btn btn-info" style="margin-right: 20px;"><div><i class="zmdi zmdi-roller"></i></div><p>&nbsp;&nbsp; Limpiar</p> </button>
                              <button id="guardar"  type="submit" class="btn btn-primary" ><div id="estatus"><i class="zmdi zmdi-floppy"></i></div> <p id="boton">&nbsp;&nbsp; Guardar</p> </button>
                                          
                                         <div id="mensaje"></div>
                                     </p>
                                  
                                  </div>
                                  
                              </div>
                              
                          </div>
                      </form>
                      
        `);

        if (libro.libro[0].destino === 'no aplica'){
          let q ="a#"+libro.libro[0].cota;
          añadirAtt(q);
        }

        if(libro.libro[0].tipo_l === 'trabajo de grado'){
            $("div#tutor").append(`
           <input id="tutor" name="tutor_t" type="text" class="tooltips-general material-control" placeholder="Tutor del libro" required="" pattern="[Áa-z- -ñ]{1,}" maxlength="70" value="${libro.libro[0].tutor}" data-toggle="tooltip" data-placement="top" title="Escribe el nombre del tutor del libro">
                       <span class="highlight"></span>
                       <span class="bar"></span>
                       <label>Autor</label>`);
        };
        $("div#myModal").modal('show');
     //  window.open('/hola','_target');
      
    })
      .fail(function (error) {
        $("div#cargando").html(
          `<img src="/assets/icons/notificacion-error.ico"width= "20" height= "20">`
        );
      });
    };


function removerCampo(campo){
        alert(campo);
        $(campo).remove();
    };
function eliminarLibro(input){
     let r = confirm('¿Estas seguro que deseas eliminar este libro?');
     if (r){
let cota = $(input).attr("id");
let c = "div#"+cota+0;
        $.ajax({
      beforeSend: function () {
        $("div#cargando").html(
          '<p class="text-center"><img src="/assets/gif/loading-22.gif"width= "20" height= "20"></p>'
        );
        
      },
      url: `/bibliotecario/eliminar?cota=${cota}`,
      type: 'DELETE'
    })
      .done(function (librosEliminados) {
        $("div#cargando").html('');
       removerCampo(c);
       $("div#cargando").html(`<h3 class="text-center">Se ha eliminado ${librosEliminados.librosEliminados} libro</h>`);
        
      
   
      })
      .fail(function (error) {
        $("div#cargando").html(
          `<p class="text-center"><img src="/assets/icons/robot.ico"width= "20" height= "20">Ha ocurrido un error</p>`
        );
      });
    };
    };
function añadirTutor(input){
        if ($(input).val() === 'Trabajo de grado'){
        
        $('div#div-contenedor').show();
        }else{
            $('div#div-contenedor').hide();
        }
    };
function ocultarCampos(check){
       let solicitud = '';
    var isChecked = document.getElementById("ocultar").checked; 
    if (isChecked){
        $('form#formato-enlinea').hide();
       solicitud =  $.ajax({
      beforeSend: function () {
        $("div#cargando").html(
          '<p class="text-center"><img src="/assets/gif/loading-22.gif"width= "20" height= "20"></p>'
        );
        
      },
      url: '/bibliotecario/todos-libros',
      type: 'POST',
      timeout: 3000
    })
      .done(function (libros) { 
          let resultados = libros.libros.length;
          if(resultados>0){
        $("div#cargando").html(`<h3 class="text-center">Se obtuvieron ${resultados} resultados de tu busqueda</h3>`);
        $("div#container").html(` <div class="container-fluid" >
            <h2 class="text-center all-tittles">Resultados</h2>
            <div class="table-responsive">
                <div class="div-table" style="margin:0 !important;">
                    <div class="div-table-row div-table-row-list" style="background-color:#DFF0D8; font-weight:bold;">
                        <div class="div-table-cell" style="width: 6%;">#</div>
                        <div class="div-table-cell" style="width: 10%;">Cota</div>
                        <div class="div-table-cell" style="width: 10%;">Tipo libro</div>
                        <div class="div-table-cell" style="width: 8%;">Titulo</div>
                        
                        <div class="div-table-cell" style="width: 6%;">Ver/Editar</div>
                        <div class="div-table-cell" style="width: 6%;"> 
                        Eliminar</div>
                    </div>
            </div>
        <div id="libros"> </div>
        </div>`);
        for (var i=0; i< libros.libros.length; i++){
          
        $("div#libros").append(`
        <div class="table-responsive" id="${libros.libros[i].cota}0">
                <div class="div-table" style="margin:0 !important;">
                    <div class="div-table-row div-table-row-list">
                        <div  class="div-table-cell" style="width: 6%;">${i+1}</div>
                        <div id="${libros.libros[i].cota}_cota" class="div-table-cell" style="width: 10%;">${libros.libros[i].cota}</div>
                        <div id="${libros.libros[i].cota}_tipo" class="div-table-cell" style="width: 10%;">${libros.libros[i].tipo_l}</div>
                        
                        <div id="${libros.libros[i].cota}_titulo" class="div-table-cell" style="width: 8%;">${libros.libros[i].titulo}</div>
                        
                       
                        <div class="div-table-cell" style="width: 6%;">
                            
                            <button class="btn btn-info" id="id-${libros.libros[i].cota}" onclick="javascript:ver(this)" if ><i class="zmdi zmdi-file-text"></i></button>
                        
                    </div>
                        <div class="div-table-cell" style="width: 6%;">
                            
                            <button   id="${libros.libros[i].cota}" onclick="eliminarLibro(this)" class="btn btn-danger"><i class="zmdi zmdi-delete"></i></button>
                            
                            </div>
                    </div>
                </div>
            </div>`);
        }
       
   document.getElementsByTagName("button")[1].focus({preventScroll:true});
    }else{
        $("div#cargando").html(`<h3 class="text-center">No se obtuvieron resultados</h3>`);
        }
      })
      .fail(function (error) {
        $("div#cargando").html(
          `<img src="/assets/icons/notificacion-error.ico"width= "20" height= "20">`
        );
      });


    }else{
        
        $('form#formato-enlinea').show();
        $("div#container").html('');
    }
   };
function actualizarFormato(t, tp, libro){
$(t).html(`${libro.titulo}`);
$(tp).html(`${libro.tipo_l}`);
}
 $(function(){
    $(document).on('click', '.modal', function(){
   $("form#actualizar").on('submit', function(e){
    e.preventDefault();
    let data = new FormData(this);

    var isChecked = document.getElementById("mostrar").checked;
    if (isChecked) {
      data.delete("pdf");
    }
    $.ajax({
      beforeSend: function () {
        
        $("p#boton").html("Guardando...");
      },
      url: "/bibliotecario/actualizar",
      type: "POST",
      data: data,
      processData: false,
      contentType: false,
    })
      .done(function (res) {
        $("div#estatus").html(
          `<img src="/assets/icons/correcto.ico"width= "20" height= "20">`
        );
        $("div#mensaje").html(`<p class="text-center">${res.mensaje}</p>`);
        $("p#boton").html("Se ha actualizado");
        let titulo = `div#${res.libro.cota}_titulo`;
        let tipo = `div#${res.libro.cota}_tipo`;
        actualizarFormato(titulo, tipo, res.libro);
        
       
        $("div#myModal")
        .modal("hide")
        .on('hidden.bs.modal', function (e) {
          $("div#myModal2").modal("show");
          $(this).off('hidden.bs.modal');
        });

      })
      .fail(function (error) {
        $("div#estatus").html(
          `<img src="/assets/icons/notificacion-error.ico"width= "20" height= "20">`
        );
        $("p#boton").html("¡Ha fallado!");
      });
  
   });
});  
  $('form#formato-enlinea').on("submit", function (e) {
    e.preventDefault();

    let data = $(this).serialize();

    $.ajax({
      beforeSend: function () {
        $("div#cargando").html(
          '<p class="text-center"><img src="/assets/gif/loading-22.gif"width= "20" height= "20"></p>'
        );
        
      },
      url: '/bibliotecario/busqueda-especifica',
      type: 'POST',
      data: data
    })
      .done(function (libros) {
          let resultados = libros.libros.length;
          $("div#container").html("");
          if(resultados>0){
        $("div#cargando").html(`<h3 class="text-center">Se obtuvieron ${resultados} resultados de tu busqueda</h3>`);
        $("div#container").html(` <div class="container-fluid" >
            <h2 class="text-center all-tittles">Resultados</h2>
            <div class="table-responsive">
                <div class="div-table" style="margin:0 !important;">
                    <div class="div-table-row div-table-row-list" style="background-color:#DFF0D8; font-weight:bold;">
                        <div class="div-table-cell" style="width: 6%;">#</div>
                        <div class="div-table-cell" style="width: 10%;">Cota</div>
                        <div class="div-table-cell" style="width: 10%;">Tipo libro</div>
                        <div class="div-table-cell" style="width: 8%;">Titulo</div>
                        
                        <div class="div-table-cell" style="width: 6%;">Ver/Editar</div>
                        <div class="div-table-cell" style="width: 6%;"> 
                        Eliminar</div>
                    </div>
            </div>
        <div id="libros"> </div>
        </div>`);
        for (var i=0; i< libros.libros.length; i++){
        $("div#libros").append(`
        <div class="table-responsive" id="${libros.libros[i].cota}0">
                <div class="div-table" style="margin:0 !important;">
                    <div class="div-table-row div-table-row-list">
                        <div  class="div-table-cell" style="width: 6%;">${i+1}</div>
                        <div id="${libros.libros[i].cota}_cota" class="div-table-cell" style="width: 10%;">${libros.libros[i].cota}</div>
                        <div id="${libros.libros[i].cota}_tipo" class="div-table-cell" style="width: 10%;">${libros.libros[i].tipo_l}</div>
                        
                        <div id="${libros.libros[i].cota}_titulo" class="div-table-cell" style="width: 8%;">${libros.libros[i].titulo}</div>
                        
                        
                        <div class="div-table-cell" style="width: 6%;">
                            
                            <button class="btn btn-info" id="id-${libros.libros[i].cota}" onclick="javascript:ver(this)" if ><i class="zmdi zmdi-file-text"></i></button>
                        
                    </div>
                        <div class="div-table-cell" style="width: 6%;">
                            
                            <button   id="${libros.libros[i].cota}" onclick="eliminarLibro(this)" class="btn btn-danger"><i class="zmdi zmdi-delete"></i></button>
                            
                            </div>
                    </div>
                </div>
            </div>`);
        }
   
        document.getElementsByTagName("button")[1].focus({preventScroll:true});
    }else{
        $("div#cargando").html(`<h3 class="text-center">No se obtuvieron resultados</h3>`);
    }
      })
      .fail(function (error) {
        $("div#cargando").html(
          `<img src="/assets/icons/notificacion-error.ico"width= "20" height= "20">`
        );
      });
  });
  


  
  });