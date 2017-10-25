import React, { Component, PropTypes } from 'react';
import { isObject, get } from 'lodash';

import { ERROR_MESSAGES } from './../../../constants/validate';

const validate = (WrappedComponent) => {
  class Validate extends Component {
    componentWillMount() {
      this.validate(this.props.value);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.validate(nextProps.value);
      }
    }

    onChange = (ev) => {
      this.props.onChange(ev);
      let value = get(ev, 'target.value');

      if (!value && value !== '') {
        value = ev;
      }

      this.validate(value);
    };

    validate(value) {
      const errors = [];

      const newValue = isObject(value) && this.props.valueKey ? value[this.props.valueKey || 'value'] : value;

      Object.keys(this.props.rules).forEach((name) => {
        const options = this.props.rules[name];

        if (Validator[name] && !Validator[name](newValue, isObject(options) ? options.value : options)) {
          const errorMessage = isObject(options) && options.message ? options.message : ERROR_MESSAGES[name](newValue, options);

          errors.push(errorMessage);
        }
      });

      this.props.onError(errors);
    }

    render() {
      const props = Object.assign({}, this.props, {
        onChange: this.onChange,
        error: this.props.showError ? this.props.error : '',
      });

      return <WrappedComponent {...props} />;
    }
  }

  Validate.propTypes = {
    onChange: PropTypes.func,
    onError: PropTypes.func,
    rules: PropTypes.object,
    showError: PropTypes.bool,
    error: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
    valueKey: PropTypes.string,
  };

  return Validate;
};

export default validate;

const Validator = {
  email(str) {
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return !str || reg.test(str);
  },
  minLength(str, value) {
    return !str || str.toString().trim().length >= value;
  },
  maxLength(str, value) {
    return !str || str.toString().trim().length <= value;
  },
  ru(str) {
    return !str || !/[^ЁёА-Яа-я- ]/.test(str.toString().trim());
  },
  required(str) {
    return str && str.toString().trim().length > 0;
  },
};
