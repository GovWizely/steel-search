import React, { Component, PropTypes } from 'react';
import { reduxForm, change } from 'redux-form';
import Select from 'react-select';
import moment from 'moment';
import FormMessages from 'redux-form-validation';
import { generateValidation } from 'redux-form-validation';
import { requestSubGroups } from '../../actions/form_options';
import './Form.scss';

 const validations = {
    reporterCountries: {
      required: true
    },
    flowType: {
      required: true
    },
    partnerCountries: {
      required: true
    },
    productGroups: {
      required: true
    },
    flowDirection: {
      required: false
    },
    comparisonIntervalStart: {
      required: false
    },
    comparisonIntervalEnd: {
      required: false
    },
    piePeriod: {
      required: true
    }
   };

const SelectField = ({ description, field, label = 'Untitled', options, multi = false, dispatch = null }) => (
  <div>
    <label htmlFor={field.name}>{label}</label>
    {description ? <p>{description}</p> : null}
    <div>
      <Select
        {...field}
        options={options}
        multi={multi} autoBlur
        onBlur={() => field.onBlur(field.value)}
        joinValues = {true}
        delimiter = {','}
        simpleValue = {true}
        onChange={event => {
          field.onChange(event)
          if (dispatch)
            dispatch(requestSubGroups(event))
        }}
      />
    </div>
  </div>
);
SelectField.propTypes = {
  description: PropTypes.string,
  field: PropTypes.object.isRequired,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  multi: PropTypes.bool,
};

class Form extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    formOptions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { 
      fields: {  reporterCountries, partnerCountries, productGroups, flowType, flowDirection, comparisonIntervalStart, comparisonIntervalEnd, piePeriod }, 
      handleSubmit,
      formOptions 
    } = this.props;

    return (
      <form className="explorer__form" onSubmit={handleSubmit}>
        <fieldset>

          <div className="explorer__form__row">
            <div className="explorer__form__group">
              <SelectField field={reporterCountries} options={formOptions.reporterCountries} label="Reporter Country" description="" dispatch={this.props.dispatch}/>
              <FormMessages field={reporterCountries} > 
                   <p className="validation-error" when="required">
                     Must enter at least one reporter country.
                   </p>
              </FormMessages>
            </div>

            <div className="explorer__form__group">
              <SelectField field={flowType} options={formOptions.flowTypes} label="Quantity (metric tons) or Value (US dollars)" description="" />
              <FormMessages field={flowType} >
                 <p className="validation-error" when="required">
                   Must choose to report by quantity or dollar value.  
                 </p>
              </FormMessages>
            </div>
          </div>

          <div className="explorer__form__row">
            <div className="explorer__form__group">
              <SelectField field={partnerCountries} options={formOptions.partnerCountries} label="Partner Country" description="" />
              <FormMessages field={partnerCountries} >
                 <p className="validation-error" when="required">
                   Must choose a partner country.  
                 </p>
              </FormMessages>
            </div>


            <div className="explorer__form__group">
              <SelectField field={flowDirection} options={[]} label="Trade Flow (Imports or Exports)" description="" />
              <FormMessages field={flowDirection} >
                 <p className="validation-error" when="required">
                   Must choose Imports or Exports.
                 </p>
              </FormMessages>
            </div>
          </div>

          <div className="explorer__form__row">
            <div className="explorer__form__group">
              <SelectField field={productGroups} options={formOptions.productGroups} label="Product Groups" description="" />
              <FormMessages field={productGroups} >
                 <p className="validation-error" when="required">
                   Must choose a product group.  
                 </p>
              </FormMessages>
            </div>

            <div className="explorer__form__group">
              <SelectField field={comparisonIntervalStart} options={formOptions.timePeriods} label="Comparison Bar Graph Interval Start" description="" />
              <FormMessages field={comparisonIntervalStart} >
                 <p className="validation-error" when="required">
                   Must choose first comparison interval.
                 </p>
              </FormMessages>
            </div>
          </div>

          <div className="explorer__form__row">
            <div className="explorer__form__group">
              <SelectField field={piePeriod} options={formOptions.timePeriods} label="Time Period for Pie Graphs" description="" />
              <FormMessages field={piePeriod} >
                 <p className="validation-error" when="required">
                   Must choose time period for pie graphs.
                 </p>
              </FormMessages>
            </div>

            <div className="explorer__form__group">
              <SelectField field={comparisonIntervalEnd} options={formOptions.timePeriods} label="Comparison Bar Graph Interval End" description="" />
              <FormMessages field={comparisonIntervalEnd} >
                 <p className="validation-error" when="required">
                   Must choose second comparison interval.
                 </p>
              </FormMessages>
            </div>
          </div>

          <div className="explorer__form__group">
            <button className="explorer__form__submit pure-button pure-button-primary" onClick={handleSubmit}>
              <i className="fa fa-paper-plane" /> Generate Reports
            </button>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default reduxForm({
  form: 'form',
  fields: ['reporterCountries', 'partnerCountries', 'productGroups', 'flowType', 'flowDirection', 'comparisonIntervalStart', 'comparisonIntervalEnd', 'piePeriod'],
  ...generateValidation(validations)
})(Form);
