import type { RequestHandler } from './$types';
import { read, utils } from 'xlsx';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';

interface Detail {
	media?: string;
	description?: string;
	keyword?: string;
	url?: string;
	data?: string;
	assets?: string;
	cloud?: string;
	icon?: string;
	background?: string;
}

interface Row extends Detail {
	Section?: string;
	Item?: string;
	Option?: string;
}

interface SectionRow extends Detail {
	Section: string;
	Item?: string;
}

interface ItemRow extends Detail {
	Item: string;
}

interface Option extends Detail {
	value: string;
}

interface Item extends Detail {
	value: string;
}

interface Section extends Detail {
	name: string;
	Item?: string;
}

async function saveSection(sectionRow: SectionRow) {
	if (!sectionRow.Section) return;
	const { Section, ...detail } = sectionRow;
	const section: Section = { name: Section, ...detail };
	try {
		const data = await prisma.section.findFirst({
			where: {
				name: section.name
			}
		});
		const result = data
			? await prisma.section.update({
					data: section,
					where: {
						id: data.id
					}
			  })
			: await prisma.section.create({
					data: section
			  });
		return result;
	} catch (error) {
		console.log(error);
	}
}

async function saveItem(sectionId: string, itemRow: ItemRow, options: Option[]) {
	if (!itemRow.Item) return;
	const { Item, ...detail } = itemRow;
	const item: Item = { value: Item, ...detail };
	try {
		const data = await prisma.item.findFirst({
			where: {
				sectionId,
				value: item.value
			}
		});
		const result = data
			? await prisma.item.update({
					data: {
						...item,
						options: options.length ? options : undefined
					},
					where: {
						id: data.id
					}
			  })
			: await prisma.item.create({
					data: {
						sectionId,
						...item,
						options: options.length ? options : undefined
					}
			  });
		return result;
	} catch (error) {
		console.log(error);
	}
}

export const POST: RequestHandler = async (req) => {
	try {
		const body = await req.request.formData();
		const file = body.get('file') as File;
		const wb = read(await file.arrayBuffer(), {});

		const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) as Row[];

		const last = { sectionId: '' };
		let item: ItemRow = { Item: '' };
		const options: Option[] = [];

		const count = { section: 0, item: 0, option: 0 };
		for (const row of data) {
			if (row.Option) {
				count.option++;
				const value = row.Option;
				delete row.Option;
				options.push({ value, ...row });
				continue;
			}

			if (row.Section) {
				count.section++;
				const section = await saveSection(row as SectionRow);
				last.sectionId = section?.id || '';
				item = { Item: '' };
			} else if (row.Item) {
				count.item++;
				item = row as ItemRow;
			}

			await saveItem(last.sectionId, item, options);
			options.length = 0;
		}

		return new Response(JSON.stringify(count));
	} catch (e) {
		console.log(e);
		return error(500, JSON.stringify(e));
	}
};
