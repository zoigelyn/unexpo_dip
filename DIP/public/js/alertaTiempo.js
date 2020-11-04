/*function confirmarCierre(){
    var cerrar = setTimeout(cerrarSesion, 5000);
    alertity.confirm(
        'Cierre de Sesión',
        'Su Sesion Expirada, presione OK para prolongar la sesión 60 segundos',
        function(){
            clearTimeout(cerrar);
            clearTimeout(temp);
            temp = setTimeout(confirmarCierre, 5000);
            alertity.successs('Su sesión ha sido prolongada 60 segundos');
        },
        function(){
            cerrarSesion();
        }
    );
}
function cerrarSesion(){
    alertity.error('Sesión cerrada');
}
var temp = setTimeout(confirmarCierre, 10000);
$("body").on("click", ".ajs-button", function(e){
    e.stopPropagation();
});

$( document ).on('click keyup keypress keydown blur change', function(e){
    clearTimeout(temp);
    temp = setTimeout(confirmarCierre, 10000);
    console.log('actividad detectada');
});

/*
var IDLE_TIMEOUT = 60;
var _idleSecondsCounter = 0;
document.onclick = function() {
    _idleSecondsCounter = 0;
};
document.onmousemove = function() {
    _idleSecondsCounter = 0;
};
document.onkeypress = function() {
    _idleSecondsCounter = 0;
};
window.setInternal (CheckIdleTime, 1000);
 
function CheckIdleTime() {
    _idleSecondsCounter++;
    var oPanel =
    document.getElementById("SecondsUntilExpire");
    if(oPanel)
    oPanel.innerHTML =
    (IDLE_TIMEOUT - _idleSecondsCounter)+"";
    if(_idleSecondsCounter >= IDLE_TIMEOUT) {
        alert("Time expired!");
        document.location.href = "logout.html";
    }
}
/*
var pepe;
function ini() {
    pepe = setTimeout('location="http://www.timeout.org/timeout.png', 915000);
}
function parar() {
    clearTimeout(pepe);
    pepe = setTimeout ('location="http://www.timeout.org/timeout.png', 915000);
}*//*
var valor = 60;
var idtime = 0;
function alerta(){
    idtime = 0;
}

function alerta2(){
    idtime ++;
    var existeId = document.getElementById("prueba");
    if (existeId) {
    if (idtime >= valor)
    {
        alert("Su sesion esta por expirar");
        document.location.href = "/logout";
    }
     }
}


window.onload = function() {
   document.getElementById("prueba").onmouseover = alerta;
   document.getElementById("prueba").onclick = alerta;
   document.getElementById("prueba").onkeypress = alerta;
    };

window.setInterval(alerta2, 10000);  
*/
/*
const upload = document.querySelector('input[type=file').files[0];
watermark([upload, '/assets/img/unexpo_big.jpg'])
.image(waterMark.image.lowerLeft(0.5))
.then(img => document.getElementById('container').appendChild(img));
*//*
$(function () {
$('a#libros').on('click', function () {
    $.ajax({
        url: '/libros',
        success: function(libros) {
            let divcuadro = $('div#cuadro');
            let divlibros = $('div#libros');
            divcuadro.html('');
            libros.forEach(libro => {
            divlibros.append(`
            <div class="row">
                <div class="col-xs-12 col-sm-4 col-md-3">
                    <img src="/assets/img/checklist.png" alt="pdf" class="img-responsive center-box" style="max-width: 110px;">
                </div>
                <div class="col-xs-12 col-sm-8 col-md-8 text-justify lead">
                    Bienvenido al catálogo, selecciona una categoría de la lista para empezar, si deseas buscar un libro por nombre o título has click en el icono &nbsp; <i class="zmdi zmdi-search"></i> &nbsp; que se encuentra en la barra superior
                </div>
            </div>
        </div>
        <div class="container-fluid" style="margin: 0 0 50px 0;">
            <h2 class="text-center" style="margin: 0 0 25px 0;">Categorías</h2>
            <ul class="list-unstyled text-center list-catalog-container">
                <li class="list-catalog">Categoría</li>
                <li class="list-catalog">Categoría</li>
                <li class="list-catalog">Categoría</li>
            </ul>
        </div>
        <div class="container-fluid">
          
               <% for ( var i=0; i < libros.length; i++) { %>
             <div class="media media-hover">
                <div class="media-left media-middle">
                    <a href="#!" class="tooltips-general" data-toggle="tooltip" data-placement="right" title="Más información del libro">
                      <img class="media-object" src="/assets/img/book.png" alt="Libro" width="48" height="48">
                    </a>
                </div>
                
                <div class="media-body">
                    <h4 class="media-heading"><%=i+1%>-<%=libros[i].titulo%></h4>
                    <div class="pull-left">
                        <strong><%=libros[i].autor%><br>
                        <strong><%=libros[i].año%><br>
                    </div>
                    <p class="text-center pull-right">
                        <a href="#!" class="btn btn-info btn-xs" style="margin-right: 10px;"><i class="zmdi zmdi-info-outline"></i> &nbsp;&nbsp; Más información</a>
                    </p>
                    <% if (libros[i].estado_l === 'disponible') { %>
                        
                  <div class="text-center pull-right">
                        <form method="POST"  action='/usuario/libros/reservar?cota=<%= libros[i].cota%>'>
                            <button class="btn btn-success btn-xs" style="margin-right: 10px;">
                             &nbsp;&nbsp; Reservar</button>
                        </form>
                    </div>
                    <% } else { %>
                        <p class="text-center pull-right">
                            <a class="btn btn-danger btn-xs" style="margin-right: 10px;"> &nbsp;&nbsp; No disponible</a>
                        </p>
               <% } %>
            </div>
            `)
        })

        }
    })

})
}); */
/*
$(function () {
    $("input#correo").on("change", function () {
var formData = new FormData();
formData.append("correo", $("input#correo").val());

        $.ajax({
            url: "/login-exist",
            dataType: "html",
            type: "POST",
            body: formData,
            processData: false
            
        })
        .done(function(res){
            $("div#mensaje").html(res);
        })
        .fail(function(){
            $("div#mensaje").html(`<a class="center-text">no respuesta</a>`);
        });
    });
});
*/
    
    
    
/*$(window).unload(function () {
    $.get('/logout');
});*/
$(window).onclose(function () {
    $.get('/logout');
});