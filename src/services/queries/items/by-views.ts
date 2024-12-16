import { client } from '$services/redis';
import { itemsByViewsKey, itemsKey } from '$services/keys';
import { deserialize } from '$services/queries/items/deserialize';

export const itemsByViews = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	let results: any = await client.sort(
		itemsByViewsKey(),
		{
			GET: [
				'#',
				`${itemsKey('*')}->name`,
				`${itemsKey('*')}->views`,
				`${itemsKey('*')}->endingAt`,
				`${itemsKey('*')}->imageUrl`,
				`${itemsKey('*')}->price`,
			],
			BY: 'nosort', // data is already sorted in the sorted set
			DIRECTION: order,
			LIMIT: {
				offset,
				count,
			},
		}
	)

	const items = []
	while (results.length > 0) {
		const [id, name, views, endingAt, imageUrl, price, ...rest] = results
		const item = deserialize(id, { name, views, endingAt, imageUrl, price })
		items.push(item)
		results = rest
	}

	return items
}
