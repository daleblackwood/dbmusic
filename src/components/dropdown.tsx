export function Dropdown(props: { 
	options: Record<string, string> | readonly string[],
	selected?: string,
	className?: string,
	onSelect: (value: string) => unknown
}) {
	const entries = Array.isArray(props.options) ? props.options.map(x => [x, x]) : Object.entries(props.options);
	return (
		<select className={props.className} onChange={e => props.onSelect(e.currentTarget.value)}>
			{entries.map(([value, text]) => (
				<option 
					key={value} 
					value={value}
				>
					{text}
				</option>
			))}
		</select>
	);
}
