import { Tile } from '../src/Tile'

exports.up = pgm => {
  pgm.createFunction(
    'notify_tile_update',
    [],
    {
      returns: 'TRIGGER',
      language: 'plpgsql'
    },
    `begin
       PERFORM(
         pg_notify('tile_updated'::text, row_to_json(NEW)::text)
       );
       RETURN NULL;
     end;`
  )
  pgm.createTrigger(Tile.tableName, 'notify_tile_update_trigger', {
    when: 'AFTER',
    operation: ['UPDATE'],
    function: 'notify_tile_update',
    level: 'ROW'
  })
}

exports.down = pgm => {
  pgm.dropTrigger(Tile.tableName, 'notify_tile_update_trigger')
  pgm.dropFunction('notify_tile_update', [])
}
