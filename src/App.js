import React from 'react';

var jsonFormData = require("./data.json");

/**
 * Field
 * - Component
 * - Renders an inputfield
 */
class Field extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.props.onChange.bind(this);
  }

  render() {
    let field;

    //Puts the correct html in let field
    //When the input type is a dropdown, the html should be an select with options
    //else the input type is added in the <input> attritubte
    if(this.props.type === 'dropdown') {

      let options = this.props.options.map((item, key) => {
        return <option value={item} key={key}>{item}</option>
      });

      field = <select className="form-control" id={this.props.name} onChange={this.handleChange} name={this.props.name}>{ options }</select>

    } else {

      field = <input 
                className="form-control" 
                name={this.props.name}
                type={this.props.type} 
                id={this.props.name} 
                placeholder={this.props.label}
                onChange={this.handleChange}
              />
    }

    return (
      <div className="form-group">
          <label htmlFor={this.props.name}>{this.props.label}</label>
          { field }
      </div>
    );
  }
}

/**
 * Question
 * - Component
 * - Renders a group of inputfields
 */
class Question extends React.Component {
  render(){

    let fields = this.props.fields.map((item, key) => {
      return ( 
        <Field 
          key={key} 
          name={item.name} 
          label={item.label} 
          type={item.type}
          {...(item.options ? {options: item.options} : {})}
          onChange={(event) => this.props.onChange(event)}
        />
      );
    });

    return (
      <div>
        <h4>{this.props.title}</h4>
        { fields }
      </div>
    );
  }
}

/**
 * Form
 * - Component
 * - Renders a form with different questions and inputfields
 */
class Form extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
        formValues: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setupEmptyStateInputs();
  }

  /**
   * Sets up an empty object in the state with keys from the JSON with the inputfields names
   * When the inputfield is a dropdown. The default value is the first item in options
   */
  setupEmptyStateInputs() {
    let formValues = {};
    jsonFormData.questions.map((item, key) => {
       item.fields.map((item, key) => {
        if(item.type === 'dropdown'){
          formValues[item.name] = item.options[0]
        } else {
          formValues[item.name] = '';
        }
      });
    });

    this.state.formValues = formValues;
  }

  /**
   * - Updates the state with the inputfield value when a change is detected in the inputfield
   * - TODO: I should not mutate state directly. But setState() gives a warning that the the component isnt mounted yet.
   * @param event 
   */
  handleChange(event) {
    let formValues = this.state.formValues;
    let name = event.target.name;
    let value = event.target.value;

    formValues[name] = value;
  }

  /**
   * - When the form is submitted, the results will be logged in the console
   * @param event 
   */
  handleSubmit(event) {
    event.preventDefault();

    Object.entries(this.state.formValues).map(([key, value]) => {
        console.log(key + ': ' + value)
  })
    
  }

  render() {
    let questions = jsonFormData.questions.map((item, key) => {
      return (
        <Question
          key={key} 
          title={item.title} 
          fields={item.fields}
          onChange={(event) => this.handleChange(event)}
        />
      );
    });

    return(
      <form onSubmit={this.handleSubmit}>
        { questions }
        <button className="btn btn-primary mb-4 mt-3">Submit</button>
      </form>
    );
  }
}

/**
 * Page
 * - Component
 * - Renders the main page
 */
class Page extends React.Component {
  render() {
    return(
      <div className="container">
          <div className="row mt-5">
            <div className="col-12">
              <div>
                <h1 className="mb-3">Formulier</h1>
                <Form/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
  
export default Page;
