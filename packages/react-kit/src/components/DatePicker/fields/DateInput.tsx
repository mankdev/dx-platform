import * as React from 'react';
import * as moment from 'moment';
import * as classnames from 'classnames';
import { Input, TInputProps } from '../../input/Input';
import { Moment } from 'moment';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withTheme } from '../../../utils/withTheme';
import { ComponentClass } from 'react';
import { KeyCode } from '../../Control/Control';

type TDatePickerDateInputFullProps = {
	value: Moment,
	dateFormat: string,
	onChange: any,
	min: Moment,
	max: Moment,
	openDatePicker: any,
	closeDatePicker: any,
	isDisabled: boolean,
	isInvalid: boolean,
	locale: string,
	placeholder: string,
	isDatePickerOpened: boolean,
	theme: {
		field?: string,
		field_invalid?: string,
	},
	Input: React.ComponentClass<TInputProps> | React.SFC<TInputProps>,
};

class RawDatePickerDateInput extends React.Component<TDatePickerDateInputFullProps> {
	static defaultProps = {
		Input,
	}

	state = {
		displayedDate: this.formatDateForView(this.props)
	}

	componentWillReceiveProps(newProps: TDatePickerDateInputFullProps) {
		this.setState({
			displayedDate: this.formatDateForView(newProps)
		});
	}

	render() {

		const {
			theme,
			isDisabled,
			isInvalid,
			Input
		} = this.props;

		const inputTheme = {
			container: classnames(theme.field, {
				[theme.field_invalid as string]: isInvalid
			})
		};

		return (
			<Input value={this.state.displayedDate}
			       theme={inputTheme}
			       onClick={this.onClick}
			       onValueChange={this.onChange}
			       onBlur={this.onBlur}
			       onKeyDown={this.onKeyDown}
			       isDisabled={isDisabled}/>
		);
	}

	private formatDateForView(props: TDatePickerDateInputFullProps): string {
		return props.isInvalid ? props.placeholder : props.value.format(props.dateFormat);
	}

	private setNewValue(inputString: string) {
		const {dateFormat, locale, value, onChange} = this.props;
		if (inputString !== value.format(dateFormat)) { // if changed
			const inputDate = moment(inputString, dateFormat, locale);
			onChange && onChange(inputDate);
		}
	}

	private onClick = () => {
		const {isDatePickerOpened} = this.props;
		if (!isDatePickerOpened) {
			this.props.openDatePicker();
		}
	}

	private onChange = (value: string) => {
		this.setState({
			displayedDate: value
		});
	}

	private onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		this.setNewValue(e.target.value);
	}

	private onKeyDown = (e: any) => {
		if (e.keyCode === KeyCode.Enter) {
			this.setNewValue(e.target.value);
			this.props.closeDatePicker();
		}
	}

}

export type TDateInputProps = ObjectClean<PartialKeys<TDatePickerDateInputFullProps, 'theme' | 'Input'>>;
export const DatePickerDateInput: ComponentClass<TDateInputProps> = withTheme(Symbol(''))(RawDatePickerDateInput);