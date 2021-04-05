interface CanvasError {
	errors: { message: string }[];
}

interface GetCanvasSelfSuccess {
	created_at: string;
	effective_locale: string;
	email: string;
	id: number;
	integration_id: string | null;
	locale: string | null;
	login_id: string;
	name: string;
	permissions: {
		can_update_avatar: boolean;
		can_update_name: boolean;
		limit_parent_app_web_access: boolean;
	};
	short_name: string;
	sis_import_id: string | null;
	sis_user_id: string | null;
	sortable_name: string;
}

interface GetCanvasUserEnrollmentsSuccess {
	associated_user_id: null;
	course_id: number;
	course_integration_id: null;
	course_section_id: number;
	created_at: string;
	end_at: null;
	enrollment_state: string;
	html_url: string;
	id: number;
	last_activity_at: string;
	last_attended_at: null;
	limit_privileges_to_course_section: boolean;
	role: string;
	role_id: number;
	root_account_id: number;
	section_integration_id: null;
	sis_account_id: null;
	sis_course_id: null;
	sis_import_id: null;
	sis_section_id: null;
	sis_user_id: null;
	start_at: null;
	total_activity_time: number;
	type: string;
	updated_at: string;
	user: {
		created_at: string;
		id: number;
		integration_id: null;
		login_id: string;
		name: string;
		short_name: string;
		sis_import_id: null;
		sis_user_id: null;
		sortable_name: string;
	};
	user_id: number;
}

interface GetCanvasUserProfileSuccess {
	bio: null;
	calendar: {
		ics: 'https://ucf-canvas.ngrok.io/feeds/calendars/user_NqSEWsfMhEXec5iBQJocNvDNwM5Y9OP3GGpUogS5.ics';
	};
	effective_locale: 'en';
	id: 1;
	integration_id: null;
	locale: null;
	login_id: 'Group44';
	lti_user_id: '535fa085f22b4655f48cd5a36a9215f64c062838';
	name: 'Group44';
	primary_email: 'fake@email.com';
	short_name: 'Group44';
	sis_user_id: null;
	sortable_name: 'Group44';
	time_zone: 'America/New_York';
	title: null;
}

interface GetUserSettingSuccess {
	settings: {
		document: string;
	};
}

interface SetUserSettingSuccess extends GetUserSettingSuccess {}
