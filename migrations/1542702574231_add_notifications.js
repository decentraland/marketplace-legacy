import { Publication, Parcel } from '../src/Asset'

exports.up = pgm => {
  pgm.createFunction(
    'notify_parcels_update',
    [],
    {
      returns: 'TRIGGER',
      language: 'plpgpsql'
    },
    `
    begin
      PERFORM(
        SELECT pg_notify('parcels_update')
      );
      RETURN NULL;
    end;`
  )
  pgm.createTrigger(Parcel.tableName, 'notify_parcels_update_trigger', {
    when: 'AFTER',
    operation: ['INSERT', 'UPDATE', 'DELETE'],
    function: 'notify_parcels_update',
    level: 'STATEMENT'
  })
  pgm.createFunction(
    'notify_publication_update',
    [],
    {
      returns: 'TRIGGER',
      language: 'plpgpsql'
    },
    `
    begin
      PERFORM(
        SELECT pg_notify('publications_updated')
      );
      RETURN NULL;
    end;`
  )
  pgm.createTrigger(
    Publication.tableName,
    'notify_publication_update_trigger',
    {
      when: 'AFTER',
      operation: ['INSERT', 'UPDATE', 'DELETE'],
      function: 'notify_publication_update',
      level: 'STATEMENT'
    }
  )
}

exports.down = pgm => {
  pgm.dropFunction('notify_parcels_update', [])
  pgm.dropTrigger(Publication.tableName, 'notify_publication_update_trigger')
  pgm.dropFunction('notify_parcels_update', [])
  pgm.dropTrigger(Publication.tableName, 'notify_parcels_update_trigger')
}
