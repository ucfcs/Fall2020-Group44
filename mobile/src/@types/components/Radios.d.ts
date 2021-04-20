interface RadioProps {
	options: Option[];
	disable: boolean;
	onSelect: (option: Option) => void;
}

interface Option {
	key: string;
	text: string;
}
