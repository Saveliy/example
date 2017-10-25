import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { size } from 'lodash';

import GarageWidget from './GarageWidget';
import * as garageActions from './../../actions/newGarage';
import HttpProvider from '../../api/HttpProvider';

import { HorizontalSelectCarPanel } from './../../components/Garage/HorizontalSelectCarPanel';
import { HorizontalCarPanel } from './../../components/Garage/HorizontalCarPanel';

// import { STATIC_URLS, CATALOGS_PATH } from './../../constants/routes';

import './../../assets/scss/blocks/garage-horizontal-widget.scss';

class GarageHorizontalWidget extends Component {
  onAddCar = (modificationId) => {
    HttpProvider.getCarModification(modificationId).then((res) => {
      // Преобразовать в структуру данных которые используются в гараже.
      const newCar = {
        creationDate: `${res.startProductionYear}-01-01T00:00:00`,
        manufacturer: res.markName,
        markId: res.markId,
        model: res.modelName,
        modelId: res.modelId,
        modification: res.name,
        variationId: res.id,
        url: res.modelImageUrl,
      };

      this.props.garageActions.select(newCar, true);
    });
  };

  onDeleteSelectCar = () => {
    this.props.garageActions.deselect();
  };

  getCar() {
    return <HorizontalCarPanel car={this.props.selectedCar} onDelete={this.onDeleteSelectCar} />;
  }

  getSelectCar() {
    return (
      <HorizontalSelectCarPanel onAdd={this.onAddCar} />
    );
  }

  getLeftColumn() {
    const { selectedCar } = this.props;

    return (
      <div className="col-md-9">
        {
          selectedCar ? this.getCar() : this.getSelectCar()
        }
      </div>
    );
  }

  render() {
    return (
      <div className="b-garage-horizontal-widget row align-items-end">
        {!this.props.user.fetching && this.getLeftColumn()}
        <div className="col-md-3">
          <GarageWidget />
        </div>
      </div>
    );
  }
}

GarageHorizontalWidget.propTypes = {
  selectedCar: PropTypes.object,
  garageActions: PropTypes.objectOf(PropTypes.func),
  user: PropTypes.object,
};

function mapStateToProps(state) {
  const { selectedCar } = state.garage;

  return {
    selectedCar: size(selectedCar) ? selectedCar : null,
    cars: state.garage,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    garageActions: bindActionCreators(garageActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GarageHorizontalWidget);
