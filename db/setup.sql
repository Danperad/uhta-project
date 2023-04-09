CREATE DATABASE uhta;
GO
USE uhta;
GO
CREATE SCHEMA uhta;
GO

CREATE TABLE uhta.materials
(
    material_id         int IDENTITY (1, 1),
    csss                int           NOT NULL,
    nr_3                int           NOT NULL,
    title               nvarchar(100) NOT NULL,
    producer            nvarchar(100) NOT NULL,
    material_type       nvarchar(9)   NOT NULL CHECK (material_type IN (N'Прибор', N'Расходник')),
    unit_of_measurement nvarchar(3)   NOT NULL CHECK ( unit_of_measurement IN (N'ШТ', N'КМП', N'М', N'УПК', N'КГ', N'Т', N'М2') ),
    is_deleted          bit           NOT NULL DEFAULT (0),
    count_in_stock      int           NOT NULL DEFAULT (0),
    count_in_operation  int           NOT NULL DEFAULT (0),
    CONSTRAINT pk_device PRIMARY KEY (material_id)
);

CREATE TABLE uhta.binding
(
    device_id      int NOT NULL,
    consumables_id int NOT NULL,
    CONSTRAINT pk_binding PRIMARY KEY (device_id, consumables_id)
);

CREATE TABLE uhta.reports
(
    report_id   int IDENTITY (1, 1),
    file_name   nvarchar(100) NOT NULL,
    date_from   date          NOT NULL,
    date_before date          NOT NULL,
    CONSTRAINT pk_report PRIMARY KEY (report_id)
);

CREATE TABLE uhta.applications
(
    application_id     int IDENTITY (1, 1),
    application_date   date NOT NULL,
    application_period bigint,
    CONSTRAINT pk_application PRIMARY KEY (application_id)
);

CREATE TABLE uhta.materials_application
(
    material_id    int NOT NULL,
    application_id int NOT NULL,
    material_count int NOT NULL,
    CONSTRAINT pf_materials_application PRIMARY KEY (material_id, application_id),
    CONSTRAINT fk_device_application_device FOREIGN KEY (material_id) REFERENCES uhta.materials (material_id),
    CONSTRAINT fk_device_application_application FOREIGN KEY (application_id) REFERENCES uhta.applications (application_id)
);

CREATE TABLE uhta.users
(
    user_id       int IDENTITY (1,1),
    user_login    nvarchar(20) NOT NULL,
    user_password nvarchar(64) NOT NULL,
    user_role     nvarchar(10) NOT NULL CHECK (user_role IN (N'ADMIN', N'WORKER', N'GUEST')),
    CONSTRAINT pk_user PRIMARY KEY (user_id)
);