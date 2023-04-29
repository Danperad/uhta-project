-- noinspection SqlResolveForFile

alter table uhta.consumables
    add constraint u_consumable_csss
        unique (csss)
go

alter table uhta.consumables
    add constraint u_consumable_nr
        unique (nr_3)
go

alter table uhta.devices
    add constraint u_device_csss
        unique (csss)
go

alter table uhta.devices
    add constraint u_device_nr
        unique (nr_3)
go

