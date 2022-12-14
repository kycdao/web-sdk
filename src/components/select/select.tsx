import clsx from "clsx"
import {
	FC,
	MouseEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import classes from "./_select.module.scss"

import { Option } from "./option"

type InputProps = {
	placeholder?: string
	onChange: (value: string) => void
	disabled?: boolean
	id?: string
	className?: string
	value?: string
	values: { value: string; label: string }[]
}

export const Select: FC<PropsWithChildren<InputProps>> = ({
	disabled,
	placeholder = "",
	onChange,
	id,
	className,
	value,
	values,
}) => {
	const onChangeEventHndlr = useCallback(
		(newValue: string) => () => {
			onChange(newValue)
			setOpen(false)
		},
		[onChange]
	)

	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function closeEventHndlr(this: Document, event: globalThis.MouseEvent) {
			if (
				ref.current &&
				event.target &&
				!ref.current.contains(event.target as Node)
			) {
				setOpen(false)
			}
		}

		document.addEventListener("mousedown", closeEventHndlr)

		return () => document.removeEventListener("mousedown", closeEventHndlr)
	}, [])

	return (
		<div ref={ref}>
			<div
				id={id}
				className={clsx(
					classes["kyc-dao-web-sdk-select"],
					disabled && classes["kyc-dao-web-sdk-opener-disabled"],
					className,
					open && classes["kyc-dao-web-sdk-open"]
				)}
				placeholder={placeholder}
				onClick={(e: MouseEvent) => setOpen(true)}>
				{values.find((v) => v.value === value)?.label}
			</div>
			{open &&
				values.map(({ label, value }, i) => (
					<Option
						className={clsx(i === 0 && "first")}
						onClick={onChangeEventHndlr(value)}
						key={value}>
						{label}
					</Option>
				))}
		</div>
	)
}
