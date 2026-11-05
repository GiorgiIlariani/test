export function objectKeys<O extends {}>(object: O): (keyof O)[] {
  return Object.keys(object) as (keyof O)[];
}
