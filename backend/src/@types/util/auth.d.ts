interface CanvasOAuthResponses {
	access_token: string;
	token_type: string;
	user: {
		id: number;
		name: string;
		global_id: string;
		effective_locale: 'en';
	};
	refresh_token: string;
	expires_in: number;
}
