import { ConfluenceSettings, ContentRestriction } from "../Settings";

export abstract class SettingsLoader {
	abstract loadPartial(): Partial<ConfluenceSettings>;

	load(): ConfluenceSettings {
		const initialSettings = this.loadPartial();
		const settings = this.validateSettings(initialSettings);
		return settings;
	}

	protected validateSettings(
		settings: Partial<ConfluenceSettings>,
	): ConfluenceSettings {
		if (!settings.confluenceBaseUrl) {
			throw new Error("Confluence base URL is really required");
		}

		if (!settings.confluenceParentId) {
			throw new Error("Confluence parent ID is required");
		}

		if (!settings.atlassianUserName) {
			throw new Error("Atlassian user name is required");
		}

		if (!settings.atlassianApiToken) {
			throw new Error("Atlassian API token is required");
		}

		if (!settings.folderToPublish) {
			throw new Error("Folder to publish is required");
		}

		if (!settings.contentRoot) {
			throw new Error("Content root is required");
		} else {
			if (!settings.contentRoot.endsWith("/")) {
				settings.contentRoot += "/";
			}
		}

		if (!("firstHeadingPageTitle" in settings)) {
			settings.firstHeadingPageTitle = false;
		}

		if (settings.defaultRestrictions) {
			for (const restriction of settings.defaultRestrictions) {
				validateRestriction(restriction);
			}
		}

		return settings as ConfluenceSettings;
	}
}

function validateRestriction(restriction: ContentRestriction) {
	if (restriction.operation == undefined) {
		throw new Error("Restriction is missing operation");
	}
	// TODO validate the operation is one of the supported type

	if (restriction.restrictions == undefined) {
		throw new Error("Restriction is missing restrictions field");
	}
	if (restriction.restrictions.user == undefined) {
		throw new Error("Restriction is missing restrictions.user field");
	}
	for (const user of restriction.restrictions.user) {
		if (user.type != "known") {
			throw new Error(
				`Restriction user is not the right type. Expected 'known' received '${user.type}'`,
			);
		}
		if (user.accountId == undefined) {
			throw new Error("Restriction group is missing accountId field");
		}
	}
	if (restriction.restrictions.group == undefined) {
		throw new Error("Restriction is missing restrictions.group field");
	}
	for (const group of restriction.restrictions.group) {
		if (group.type != "group") {
			throw new Error(
				`Restriction group is not the right type. Expected 'group' received '${group.type}'`,
			);
		}
		if (group.name == undefined) {
			throw new Error("Restriction group is missing name field");
		}
	}

	return true;
}
