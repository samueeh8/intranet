BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Cartas] (
    [NumeroRegistro] INT NOT NULL IDENTITY(1,1),
    [Fecha] DATE,
    [Empresa] NVARCHAR(max),
    [NumeroCliente] INT,
    [Destinatario] NVARCHAR(max),
    [NumeroExpediente] NVARCHAR(255),
    [TipoDeSoporte] NVARCHAR(max),
    [ModoDeEnvio] NVARCHAR(max),
    [Departamento] NVARCHAR(max),
    [Remitente] NVARCHAR(max),
    [Asunto] NVARCHAR(max),
    [PDF] VARBINARY(max),
    CONSTRAINT [PK__Registro__1ECFFBAE3C9FD0A6] PRIMARY KEY CLUSTERED ([NumeroRegistro])
);

-- CreateTable
CREATE TABLE [dbo].[Clientes] (
    [codigo] VARCHAR(255),
    [nombre] VARCHAR(255),
    [nif] VARCHAR(255),
    [direccion] VARCHAR(255),
    [codigo postal] VARCHAR(255),
    [provincia] VARCHAR(255),
    [pais] VARCHAR(255),
    [grupo empresarial] VARCHAR(255),
    [id_cliente] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK__Clientes__677F38F526384A97] PRIMARY KEY CLUSTERED ([id_cliente])
);

-- CreateTable
CREATE TABLE [dbo].[Proveedores] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(255),
    [Nombre] NVARCHAR(255),
    [Segundo nombre] NVARCHAR(255),
    [Apellidos] NVARCHAR(255),
    [Organización] NVARCHAR(255),
    [Puesto] NVARCHAR(255),
    [Calle del trabajo] NVARCHAR(255),
    [Ciudad de trabajo] NVARCHAR(255),
    [Provincia o estado de trabajo] NVARCHAR(255),
    [Código postal del trabajo] NVARCHAR(255),
    [País o región del trabajo] NVARCHAR(255),
    [Otra calle] NVARCHAR(255),
    [Otra ciudad] NVARCHAR(255),
    [Otra provincia o estado] NVARCHAR(255),
    [Otro código postal] NVARCHAR(255),
    [Teléfono del trabajo] NVARCHAR(255),
    [Teléfono del trabajo 2] NVARCHAR(255),
    [Particular] NVARCHAR(255),
    [Teléfono movil] NVARCHAR(255),
    [Otro teléfono] NVARCHAR(255),
    [Categorías] NVARCHAR(255),
    [Dirección de correo electrónico] NVARCHAR(255),
    [Dirección de correo electrónico 2] NVARCHAR(255),
    [Dirección del correo electrónico 3] NVARCHAR(255),
    [Notas] NVARCHAR(max),
    [Página web] NVARCHAR(255),
    CONSTRAINT [Contactos_definitivo$Id] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Trabajadores] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] VARCHAR(255),
    [Apellidos] VARCHAR(255),
    [Direccion] VARCHAR(255),
    [Telefono] VARCHAR(255),
    [NSegSocial] INT,
    [DNI] CHAR(9),
    [NCuentaBancaria] VARCHAR(34),
    [Contrato] VARCHAR(255),
    CONSTRAINT [Trabajadores_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[archivoAdministrativo] (
    [Clave Privada] INT NOT NULL IDENTITY(1,1),
    [Número expediente] NVARCHAR(255),
    [Palabras Clave] NVARCHAR(255),
    [Ubicación] NVARCHAR(255),
    [Numero de Caja] FLOAT(53),
    [Fecha automática] DATETIME2,
    [Notas] NVARCHAR(255),
    [Fecha documentos] NVARCHAR(255),
    [Archivo] NVARCHAR(255),
    [Préstamo] NVARCHAR(255),
    [Contenido] NVARCHAR(max),
    [Promotor] NVARCHAR(255),
    [Nº Cliente] INT,
    [proyecto] VARCHAR(255),
    CONSTRAINT [PK__registro__B01EC6D607C54408] PRIMARY KEY CLUSTERED ([Clave Privada])
);

-- CreateTable
CREATE TABLE [dbo].[Consulta Archivo Técnico] (
    [Clave privada] INT NOT NULL IDENTITY(1,1),
    [Palabras clave] NVARCHAR(255),
    [Ubicación] NVARCHAR(255),
    [Numero de Caja] FLOAT(53),
    [Fecha automática] DATETIME2,
    [Notas] NVARCHAR(255),
    [Fecha transferencia] NVARCHAR(255),
    [Nº expediente] NVARCHAR(255),
    CONSTRAINT [PK__Consulta__2D288E420FC37664] PRIMARY KEY CLUSTERED ([Clave privada])
);

-- CreateTable
CREATE TABLE [dbo].[detalles] (
    [codProyecto] INT NOT NULL IDENTITY(1,1),
    [detalle] VARCHAR(255),
    [fecha] DATE,
    CONSTRAINT [detalles_pkey] PRIMARY KEY CLUSTERED ([codProyecto])
);

-- CreateTable
CREATE TABLE [dbo].[Gestion horaria] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [HoraEntrada] TIME,
    [HoraSalida] TIME,
    CONSTRAINT [Gestion horaria_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Parte de trabajo] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [NombreProyecto] VARCHAR(255),
    [fase] VARCHAR(255),
    [horas] INT,
    [descripcion] VARCHAR(255),
    [cliente] VARCHAR(255),
    [fecha] DATE,
    CONSTRAINT [Parte de trabajo_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[proyectos] (
    [Numero Expediente] NVARCHAR(255),
    [Palabras clave] NVARCHAR(255),
    [Proyecto] NVARCHAR(255),
    [Arquitecto] NVARCHAR(255),
    [m2 construidos-suelo] FLOAT(53),
    [techo edificable] FLOAT(53),
    [m2 sotano] FLOAT(53),
    [numero viviendas] FLOAT(53),
    [Fecha Visado] NVARCHAR(255),
    [Fecha Inicio] NVARCHAR(255),
    [N Expediente Colegio] NVARCHAR(255),
    [Localidad] NVARCHAR(255),
    [Promotor] NVARCHAR(255),
    [Nº Cliente] INT,
    [Tipo de proyecto] NVARCHAR(255),
    [categoria] NVARCHAR(255),
    [uso] VARCHAR(200),
    [situacion] VARCHAR(255),
    [Tramitacion] VARCHAR(100),
    [instancias] VARCHAR(50),
    [ruta carpeta] VARCHAR(255),
    [codProyecto] INT NOT NULL IDENTITY(1,1),
    CONSTRAINT [PK__proyecto__0187B14F115B27B9] PRIMARY KEY CLUSTERED ([codProyecto])
);

-- CreateTable
CREATE TABLE [dbo].[registro ejemplares] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Revistas] NVARCHAR(255),
    [fecha] DATETIME2,
    [nEjemplar] FLOAT(53),
    [modelo especial] NVARCHAR(255),
    [nAtrasados] NVARCHAR(255),
    CONSTRAINT [registro ejemplares_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[registro fotos] (
    [Clave Privada] INT NOT NULL IDENTITY(1,1),
    [Ubicación] NVARCHAR(255),
    [Número expediente] NVARCHAR(255),
    [Palabras clave] NVARCHAR(255),
    [Contenido] NVARCHAR(255),
    [Proyecto] NVARCHAR(255),
    [Localidad] NVARCHAR(255),
    [Fecha fotos] FLOAT(53),
    [Numero foto] FLOAT(53),
    [Creación registro] DATETIME2,
    [Numero caja] NVARCHAR(255),
    [Carpeta] NVARCHAR(255),
    [Tamaño] NVARCHAR(255),
    [Sobre] NVARCHAR(255),
    [Nº Cliente] INT,
    CONSTRAINT [PK__registro__B01EC6D6DCA10FC0] PRIMARY KEY CLUSTERED ([Clave Privada])
);

-- CreateTable
CREATE TABLE [dbo].[registro libros] (
    [Registro] FLOAT(53) NOT NULL,
    [Titulo] NVARCHAR(255),
    [Autor] NVARCHAR(255),
    [Editorial] NVARCHAR(255),
    [Año publicación] FLOAT(53),
    [Tomo] NVARCHAR(255),
    [ISBN] NVARCHAR(255),
    [Ubicación] NVARCHAR(255),
    [Materia] NVARCHAR(255),
    [CDU] FLOAT(53),
    [Edición] NVARCHAR(255),
    [Notas] NVARCHAR(255),
    [Signatura] NVARCHAR(255),
    [Fecha auto] DATETIME2,
    [Nº Cliente] INT,
    CONSTRAINT [registro libros_pkey] PRIMARY KEY CLUSTERED ([Registro])
);

-- CreateTable
CREATE TABLE [dbo].[registro revista] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Revista] NVARCHAR(255),
    CONSTRAINT [PK__registro__3214EC074B0BF452] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[remitentes] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [remitente] VARCHAR(100),
    CONSTRAINT [remitentes_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B617ABAB7A6] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Contactos_definitivo$Código postal del trabajo] ON [dbo].[Proveedores]([Código postal del trabajo]);

-- AddForeignKey
ALTER TABLE [dbo].[detalles] ADD CONSTRAINT [FK_detalles_proyectos] FOREIGN KEY ([codProyecto]) REFERENCES [dbo].[proyectos]([codProyecto]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[registro ejemplares] ADD CONSTRAINT [FK__registro eje__id__2F10007B] FOREIGN KEY ([id]) REFERENCES [dbo].[registro revista]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
