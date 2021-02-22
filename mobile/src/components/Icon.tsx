import React, { FunctionComponent } from 'react';
import Svg, { Path } from 'react-native-svg';

export const Icon: FunctionComponent<IconProps> = ({ type }) => {
	return (
		<Svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
			<Path fill='#000' d='M21 6H3v2h18V6zM21 16H3v2h18v-2zM21 11H3v2h18v-2z' />
		</Svg>
	);
};
