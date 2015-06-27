
import React from 'react';
import moment from 'moment';
import {omit} from 'lodash/object';
import DatePicker from './DatePicker';
import DateUtils from './utils/DateUtils.js';

/* eslint-disable key-spacing */
const propTypes = {
  onChange:         React.PropTypes.func.isRequired,
  date:             DateUtils.evaluateDateProp,
  initialDate:      DateUtils.evaluateDateProp,
  minDate:          DateUtils.evaluateDateProp,
  maxDate:          DateUtils.evaluateDateProp,
  locale:           React.PropTypes.string,
  startMode:        React.PropTypes.string,
  fixedMode:        React.PropTypes.bool,
  format:           React.PropTypes.string,
  showOnInputClick: React.PropTypes.bool,
  autoClose:        React.PropTypes.bool,
  floating:         React.PropTypes.bool
};
/* eslint-enable key-spacing */

const DatePickerInput = React.createClass({

  propTypes: propTypes,

  getDefaultProps() {
    return {
      startMode: 'day',
      autoClose: true,
      floating: true,
      className: '',
      iconClassName: ''
    };
  },

  getInitialState() {
    const _date = this.props.date || this.props.initialDate;
    const date = typeof _date === 'string' ? moment(_date, this.getFormat(), true) : moment(_date);
    return {
      date: _date ? date : undefined,
      dateString: _date ? date.format(this.getFormat()) : '',
      showing: false
    };
  },

  toggleDatePicker() {
    this.setState({showing: !this.state.showing});
  },

  _onChangeDate(jsDate) {
    const newDate = moment(jsDate);
    const newDateString = newDate.format(this.getFormat());
    console.log(newDateString);
    if (newDateString !== this.state.dateString) {
      this.setState({
        date: newDate,
        dateString: newDateString,
        showing: !this.props.autoClose
      });
    }
    this.props.onChange(jsDate, newDateString);
  },

  onChangeInput(dateString) {
    this.setState({ dateString });
    const parsedDate = moment(dateString, this.getFormat(dateString), true);
    if (parsedDate.isValid()) {
      this.setState({date: parsedDate});
    }
    const jsDate = parsedDate.isValid() ? parsedDate.toDate() : undefined;
    this.props.onChange(jsDate, dateString);
  },

  getFormat() {
    if (this.props.format) {
      return this.props.format;
    }
    if (this.props.fixed) {
      switch (this.props.startMode) {
        case 'month':
          return 'MMMM';
        case 'year':
          return 'YYYY';
      }
    }
    // if (dateString) {
    //   const array = dateString.match(/\d+/g);
    //   if (Array.isArray(array) && array.length === 3 && array.filter((x) => x.length > 2).length === 0) {
    //     return this.props.locale === 'it' ? 'DD MM YY' : 'MM DD YY';
    //   }
    // }
    return 'L';
  },

  getDatePicker() {
    if (this.state.showing) {
      return (
        <DatePicker
          date={this.state.date ? this.state.date.toDate() : undefined}
          onChange={this._onChangeDate}
          initialDate={this.props.initialDate}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          locale={this.props.locale}
          startMode={this.props.startMode}
          fixedMode={this.props.fixedMode}
          floating={this.props.floating}
        />
      );
    }
  },

  onInputClick() {
    this.setState({showing: this.props.showOnInputClick || this.state.showing});
  },

  render() {
    const active = this.state.showing ? 'active' : '';
    const inputProps = omit(this.props, Object.keys(propTypes));

    return (
      <div className={`react-datepicker-component ${this.props.className}`}>
        <div className='react-datepicker-input'>
          <input
            valueLink={{value: this.state.dateString, requestChange: this.onChangeInput}}
            onClick={this.onInputClick}
            {...inputProps}
          />
          <div className={`input-button ${active}`} onClick={this.toggleDatePicker}>
            <i className={this.props.iconClassName} />
          </div>
        </div>
        {this.getDatePicker()}
      </div>
    );
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.date) {
      const _date = nextProps.date || nextProps.initialDate;
      const date = typeof _date === 'string' ? moment(_date, this.getFormat(), true) : moment(_date);
      this.setState({
        date: _date ? date : undefined,
        dateString: date.isValid() ? date.format(this.getFormat()) : this.state.dateString
      });
    }
  }

});

export default DatePickerInput;