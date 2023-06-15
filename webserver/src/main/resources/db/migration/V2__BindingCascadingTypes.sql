alter table uhta.binding
drop constraint fk_material_consumable;

alter table uhta.binding
    add constraint fk_material_consumable
        foreign key (consumables_id) references uhta.consumables
            on delete cascade;

alter table uhta.binding
drop constraint fk_material_device;

alter table uhta.binding
    add constraint fk_material_device
        foreign key (device_id) references uhta.devices
            on delete cascade;
