import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';

const changeOnBlur = (WrappedComponent) => {
  class ChangeOnBlur extends Component {
    state = {
      value: null,
    };

    componentWillMount() {
      this.setState({
        value: this.props.value,
      });
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.state.value) {
        this.setState({
          value: this.state.value,
        });
      }
    }

    onChange = (value) => {
      this.setState({
        value: get(value, 'target.value', value),
      });
    };

    onBlur = () => {
      if (this.props.value !== this.state.value) {
        this.props.onChange(this.state.value);
      }

      if (this.props.onBlur) {
        this.props.onBlur();
      }
    };

    render() {
      const props = Object.assign({}, this.props, {
        onChange: this.onChange,
        onBlur: this.onBlur,
        value: this.state.value,
      });

      return <WrappedComponent {...props} />;
    }
  }

  ChangeOnBlur.propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  };

  return ChangeOnBlur;
};

export default changeOnBlur;
