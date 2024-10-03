export type ContentRestriction = {
	operation: string;
	restrictions: {
		user: {
			type: string; // Must be set to "known"
			accountId: string; // If "@atlassianUserName", will reuse the id of atlassianUserName
		}[];
		group: {
			type: string; // Must be set to "group"
			name: string;
		}[];
	};
};

export type ConfluenceSettings = {
	confluenceBaseUrl: string;
	confluenceParentId: string;
	atlassianUserName: string;
	atlassianApiToken: string;
	folderToPublish: string;
	contentRoot: string;
	firstHeadingPageTitle: boolean;
	defaultRestrictions: ContentRestriction[];
};

export const DEFAULT_SETTINGS: ConfluenceSettings = {
	confluenceBaseUrl: "",
	confluenceParentId: "",
	atlassianUserName: "",
	atlassianApiToken: "",
	folderToPublish: "Confluence Pages",
	contentRoot: process.cwd(),
	firstHeadingPageTitle: false,
	defaultRestrictions: [],
};
