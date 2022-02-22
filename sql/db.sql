create table tipo_libro (
    id_tl serial primary key,
    tipo_tl varchar(20) unique not null check (tipo_tl <> ''),
    descripcion_tl varchar(100),
    created_at date,
    updated_at date

);

create table tipo_suscripcion (
    id_ts serial primary key,
    tipo_ts varchar(20) unique not null check (tipo_ts <> ''),
    descripcion_ts varchar(100),
    created_at date,
    updated_at date

);

create table estado_prestamo (
    id_ep serial primary key,
    estado_ep varchar(20) unique not null check (estado_ep <> ''),
    descripcion_ep varchar(100),
    created_at date,
    updated_at date
);

create table estado_libro (
    id_ep serial primary key,
    estado_el varchar(20) unique not null check (estado_el <> ''),
    descripcion_el varchar(100),
    created_at date,
    updated_at date
);

create table tipo_usuario (
    id_tu serial primary key,
    tipo_tu varchar(20) unique not null check (tipo_tu <> ''),
    descripcion_tu varchar(100),
    created_at date,
    updated_at date
);

create table libros(
    cota varchar(25) primary key,
    tipo_l varchar(20) not null check (tipo_l <> ''),
    autor varchar(30) not null default 'no aplica',
    tutor varchar(30) not null default 'no aplica',
    editorial varchar(30) not null default 'no aplica',
    titulo varchar(30) not null check (titulo <> ''),
    año integer not null check (año <> 0),
    volumen integer not null check (volumen <> 0),
    ejemplar integer not null check (ejemplar <> 0),
    destino text not null default 'no aplica',
    estado_l varchar(20) not null 
    created_at date,
    updated_at date,
    foreign key(estado_l) references estado_libro(estado_el),
    foreign key(tipo_l) references tipo_libro(tipo_tl)

);
create table usuarios(
    correo_u varchar(50) primary key,
    cedula_u varchar(10),
    nombres_u varchar(35) not null check (nombres_u <>''),
    apellidos_u varchar(35) not null check (apellidos_u <>''),
    clave_u varchar(10) not null check (clave_u <>''),
    tipo_u varchar(20) not null default 'lector',
    created_at date,
    updated_at date,
    foreign key(tipo_u) references tipo_usuario(tipo_tu)
);

create table fichas(
    n_solicitud serial primary key,
    cota_f varchar(25) unique not null,
    correo_f varchar(50) not null,
    fecha_e date not null, 
    fecha_d date not null,
    fecha_c date,
    estado_f varchar(20) not null,
    created_at date,
    updated_at date,
    foreign key(estado_f) references estado_prestamo(estado_ep),
    foreign key (correo_f) references usuarios(correo_u),
    foreign key (cota_f) references libros(cota)
);

create table fichas_entregadas(
    n_solicitud serial primary key,
    cota_f varchar(25) not null,
    correo_f varchar(50) not null,
    fecha_e date not null, 
    fecha_c date not null,
    estado_f varchar(20) not null,
    created_at date,
    updated_at date,
    foreign key(estado_f) references estado_prestamo(estado_ep),
    foreign key (cota_f) references libros(cota)
);

create table estudiantes (
    cedula_e varchar(10) primary key,
    nombres_e varchar(35) not null check (nombres_e <>''),
    apellidos_e varchar(35) not null check (apellidos_e <>''),
    especializacion varchar(50),
    created_at date,
    updated_at date
);

create table docentes (
    cedula_d varchar(10) primary key,
    nombres_d varchar(35) not null check (nombres_d <>''),
    apellidos_d varchar(35) not null check (apellidos_d <>''),
    materia varchar(50),
    created_at date,
    updated_at date
);

create table preguntas(
    id_p serial primary key,
    pregunta varchar(200) unique not null check (pregunta <> ''),
    created_at date,
    updated_at date
);

create table respuestas(
    id_r integer,
    id_pr integer,
    respuesta varchar(100),
    correo_r varchar(50),
    created_at date,
    updated_at date,
    primary key (id_pr, correo_r),
    foreign key(id_pr) references preguntas(id_p),
    foreign key(correo_r) references usuarios(correo_u)
);

create table conf_dias_libros(
    id_c serial primary key,
    dias_prestamo integer default 3,
    cantidad_libros integer default 3,
    created_at date,
    updated_at date
);
create table noticias(
    id_n serial primary key,
    url_imagen text not null,
    text_noticia text not null,
    titulo_noticia varchar(35),
    created_at date,
    updated_at date
);

create table preguntas_f(
    id_pf serial primary key,
    titulo_pregunta text not null,
    text_respuesta text not null,
    created_at date,
    updated_at date
);