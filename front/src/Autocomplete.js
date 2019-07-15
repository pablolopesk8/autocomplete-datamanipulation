import React from 'react';
import Autosuggest from 'react-autosuggest';

// when suggestion is clicked, Autosuggest populate the input based on the clicked suggestion
const getSuggestionValue = (suggestion) => suggestion.event;

// set the layout of the items
const renderSuggestion = suggestion => (
    <div>
        {suggestion.event}
    </div>
);

class Autocomplete extends React.Component {
    constructor() {
        super();
        // Suggestions also need to be provided to the Autosuggest and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: '',
            suggestions: []
        };

        // initial bind for the class methods
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);

    }

    // method called on each change of input
    onChange(event, { newValue }) {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions
    onSuggestionsFetchRequested({ value }) {
        // get the input value and trim them
        const inputValue = value.trim().toLowerCase();

        // only search for suggestions if input has more than 2 characters
        if (inputValue.length < 2) {
            this.setState({ suggestions: [] });
        } else {
            // get the events related with the text typed
            fetch(`http://localhost:3005/collector/events?name=${inputValue}`)
                .then((res) => {
                    // if status is 204 set the return as an empty array
                    if (res.status === 204) {
                        return [];
                    } else {
                        return res.json();
                    }
                }).then((result) => {
                    this.setState({ suggestions: result });
                });
        };
    };

    // Autosuggest will call this function every time you need to clear suggestions
    onSuggestionsClearRequested() {
        this.setState({ suggestions: [] });
    };

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input
        const inputProps = {
            placeholder: 'Type an event',
            value,
            onChange: this.onChange
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}
export default Autocomplete;