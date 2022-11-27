import type { RequestHandler } from './$types'
import { read, utils } from 'xlsx'
import { prisma } from '$lib/prisma'
import { error, json } from '@sveltejs/kit'

interface Detail {
	type?: string | number
	media?: string
	description?: string
	keyword?: string
	url?: string
	data?: string
	assets?: string
	cloud?: string
	icon?: string
	background?: string
}

interface Row extends Detail {
	Section?: string
	Item?: string
	Option?: string
}

interface SectionRow extends Detail {
	Section: string
	Item?: string
}

interface ItemRow extends Detail {
	Item: string
}

interface Option extends Detail {
	value: string
}

interface Item extends Detail {
	value: string
}

interface Section extends Detail {
	name: string
	Item?: string
}

async function saveSection(sectionRow: SectionRow) {
	if (!sectionRow.Section) return
	const { Section, ...detail } = sectionRow
	const section: Section = { name: Section, ...detail }
	const data = await prisma.section.findFirst({
		where: {
			name: section.name,
		},
	})
	const result = data
		? await prisma.section.update({
				data: { ...section, type: section.type ? Number(section.type) : undefined },
				where: {
					id: data.id,
				},
		  })
		: await prisma.section.create({
				data: { ...section, type: section.type ? Number(section.type) : undefined },
		  })
	return result
}

async function saveItem(sectionId: string, itemRow: ItemRow, options: Option[]) {
	if (!itemRow.Item) return
	const { Item, ...detail } = itemRow
	const item: Item = { value: Item, ...detail }
	const optionsData = options.length
		? options.map((option) => {
				return {
					...option,
					type: option.type ? Number(option.type) : undefined,
				}
		  })
		: undefined
	const data = await prisma.item.findFirst({
		where: {
			sectionId,
			value: item.value,
		},
	})
	const result = data
		? await prisma.item.update({
				data: {
					...item,
					type: item.type ? Number(item.type) : undefined,
					options: optionsData,
				},
				where: {
					id: data.id,
				},
		  })
		: await prisma.item.create({
				data: {
					sectionId,
					...item,
					type: item.type ? Number(item.type) : undefined,
					options: optionsData,
				},
		  })
	return result
}

export const POST: RequestHandler = async (req) => {
	try {
		const body = await req.request.formData()
		const file = body.get('file') as File
		const wb = read(await file.arrayBuffer(), {})

		const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) as Row[]

		const last = { sectionId: '' }
		let item: ItemRow = { Item: '' }
		let options: Option[] = []

		const count = { section: 0, item: 0, option: 0 }
		for (const row of data) {
			if (row.Section) {
				count.section++
				await saveItem(last.sectionId, item, options)
				options = []
				const section = await saveSection(row as SectionRow)
				last.sectionId = section?.id || ''
				continue
			}
			if (row.Item) {
				count.item++
				await saveItem(last.sectionId, item, options)
				options = []
				item = row as ItemRow
				continue
			}
			if (row.Option) {
				count.option++
				const value = row.Option
				delete row.Option
				options.push({ value, ...row })
				continue
			}
		}

		await saveItem(last.sectionId, item, options)

		return json(count)
	} catch (e) {
		console.log(new Date(), e)
		throw error(500, JSON.stringify(e))
	}
}
