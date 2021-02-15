interface RadioProps {
	options: Option[];
	onSelect: (option: Option) => void;
}

interface Option {
	key: string;
	text: string;
}
