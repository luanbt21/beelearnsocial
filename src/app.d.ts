/// <reference types="@sveltejs/kit" />

type Locales = import('$i18n/i18n-types').Locales
type TranslationFunctions = import('$i18n/i18n-types').TranslationFunctions
type User = import('@prisma/client').User

declare namespace App {
	interface Locals {
		locale: Locales
		LL: TranslationFunctions
		user?: User
	}

	// interface Platform {}

	// interface Session {}

	// interface Stuff {}
}
