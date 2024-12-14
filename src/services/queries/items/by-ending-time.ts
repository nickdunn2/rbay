import { client } from '$services/redis';
import { itemsByEndingAtKey, itemsKey } from '$services/keys';
import { deserialize } from '$services/queries/items/deserialize';
import type { Item } from '$services/types';

export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
): Promise<Item[]> => {
	const ids: string[] = await client.zRange(
		itemsByEndingAtKey(),
		Date.now(),
		'+inf',
		{
			BY: 'SCORE',
			LIMIT: {
				offset,
				count,
			}
		}
	)

	const commands = ids.map(id => client.hGetAll(itemsKey(id)))
	const items = await Promise.all(commands)

	return items.map((item, i) => deserialize(ids[i], item))
}
