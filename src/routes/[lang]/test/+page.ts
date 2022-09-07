import type { PageLoad } from './$types';
import { read, utils } from 'xlsx';
import { readFileSync } from 'fs';

export const load: PageLoad = () => {
	const file = readFileSync('English_Quiz.xlsx');
	const wb = read(file, {});
	const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
	return data;
};
