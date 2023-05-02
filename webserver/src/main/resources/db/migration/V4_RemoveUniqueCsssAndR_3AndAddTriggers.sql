alter table uhta.consumables
    drop constraint u_consumable_csss
go

alter table uhta.consumables
    drop constraint u_consumable_nr
go

alter table uhta.devices
    drop constraint u_device_csss
go

alter table uhta.devices
    drop constraint u_device_nr
go

create trigger device_delete ON uhta.devices INSTEAD OF DELETE
    as
    begin
        if (select is_deleted from deleted) = 1
        begin
            raiserror (N'Этот девайс уже удалён!', 16, 1)
        end
        else UPDATE uhta.devices SET is_deleted = 1 where device_id = (select deleted.device_id from deleted)
    end
go

create trigger consumables_delete ON uhta.consumables INSTEAD OF DELETE
    as
    begin
        if (select is_deleted from deleted) = 1
        begin
            raiserror (N'Этот расходник уже удалён!', 16, 1)
        end
        else UPDATE uhta.consumables SET is_deleted = 1 where consumables_id = (select deleted.consumables_id from deleted)
    end
go